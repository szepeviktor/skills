---
name: larastan-preflight-reviewer
description: Review Laravel Eloquent model `casts()` methods, `Attribute` accessor/mutator methods, and relationship methods before Larastan/PHPStan runs. Use when asked to audit or fix model casts, Larastan array-shape return PHPDocs, Attribute get/set generics, relationship generics, model attribute type precision, or static-analysis failures involving model casts, accessors/mutators, or relationships in `app/Models/*` or `src/Models/*`.
---

# Larastan Preflight Reviewer

## Overview

Review only Laravel Eloquent model classes under `app/Models/*` and `src/Models/*`. The goal is to catch `casts()`, `Attribute` accessor/mutator, and relationship signature and PHPDoc mismatches before Larastan analyzes the project.

## Workflow

1. Inspect the project context first.
   - Read `AGENTS.md` and follow local Laravel, PHP, and testing rules.
   - Use project documentation/search tools required by the repo before code changes.
   - Prefer `rg --files app/Models src/Models` to find candidate files. Ignore missing directories.

2. Identify model classes.
   - Include classes that extend `Illuminate\Database\Eloquent\Model` directly or through a project base model.
   - Exclude traits, factories, resources, DTOs, enums, policies, and non-model support classes even if they live near models.
   - Do not review model classes outside `app/Models/*` or `src/Models/*` unless the user explicitly expands scope.

3. For each model with a `casts()` method, verify all required rules.
   - The method must be `protected`, matching Laravel documentation.
   - The method must have an explicit PHP return type, normally `array`.
   - The PHPDoc immediately attached to the method must contain a Larastan-readable array shape for the return type.
   - The PHPDoc array shape must match the returned array keys and value types.
   - Class-string cast values in the PHPDoc must use fully qualified class names, for example `'App\Models\User'`.

4. For each model method returning `Illuminate\Database\Eloquent\Casts\Attribute`, verify all required rules.
   - The method must be `protected`, matching Laravel documentation.
   - The method must have an explicit PHP return type of `Attribute`.
   - The PHPDoc immediately attached to the method must contain the get and set types using Larastan-readable generics: `@return Attribute<TGet, TSet>`.
   - The generic get type must match the `get:` closure return value or be `never` when no getter is provided.
   - The generic set type must match the `set:` closure parameter/input value or be `never` when no setter is provided.
   - Use fully qualified class names in PHPDoc generics when referencing classes or enums, for example `Attribute<\App\Enums\Currency, never>`.

5. For each model method returning an Eloquent relationship type, verify all required rules.
   - The method must be `public`, matching Laravel relationship documentation.
   - The method must have an explicit PHP return type such as `HasOne`, `HasMany`, `BelongsTo`, `BelongsToMany`, `MorphOne`, `MorphMany`, `MorphTo`, `MorphToMany`, `HasOneThrough`, or `HasManyThrough`.
   - The PHPDoc immediately attached to the method must contain Larastan-readable relationship generics, for example `@return HasMany<\App\Models\Post, $this>`.
   - The generic related model type must match the related model class passed to relationship builders such as `hasMany(Post::class)` or `belongsTo(User::class)`.
   - The declaring model side should normally be `$this` so Larastan preserves late-static model context.
   - Use fully qualified class names in PHPDoc generics when referencing models.

6. For models without `casts()`, `Attribute`, or relationship methods, report nothing unless the user asked for a full inventory.

## Cast Pattern

Use this shape for model cast methods:

```php
/**
 * @return array{
 *     email_verified_at: 'datetime',
 *     settings: 'array',
 *     user_id: 'int',
 *     custom_value: 'App\Casts\CustomValue',
 * }
 */
protected function casts(): array
{
    return [
        'email_verified_at' => 'datetime',
        'settings' => 'array',
        'user_id' => 'int',
        'custom_value' => App\Casts\CustomValue::class,
    ];
}
```

## Attribute Pattern

Use this shape for model `Attribute` accessor/mutator methods:

```php
/**
 * @return Attribute<string, never>
 */
protected function fullName(): Attribute
{
    return Attribute::make(
        get: fn (): string => "{$this->first_name} {$this->last_name}",
    );
}

/**
 * @return Attribute<string, string>
 */
protected function slug(): Attribute
{
    return Attribute::make(
        get: fn (string $value): string => $value,
        set: fn (string $value): string => Str::slug($value),
    );
}

/**
 * @return Attribute<never, array{name: string}>
 */
protected function profile(): Attribute
{
    return Attribute::make(
        set: fn (array $value): array => [
            'name' => $value['name'],
        ],
    );
}
```

## Cast Matching Rules

- Compare array shape keys exactly against returned array keys.
- Treat `SomeClass::class` return values as the fully qualified class-name string that PHP resolves to in that namespace.
- Require PHPDoc class-string values to be fully qualified without leading slash, such as `'App\Casts\MoneyCast'`, not `'MoneyCast'` or `MoneyCast::class`.
- Preserve literal Laravel cast strings in PHPDoc, such as `'int'`, `'integer'`, `'bool'`, `'boolean'`, `'array'`, `'json'`, `'object'`, `'collection'`, `'datetime'`, `'immutable_datetime'`, `'date'`, `'decimal:2'`, `'encrypted:array'`, and enum collection cast strings.
- If the returned value is computed or conditionally built, avoid inventing a precise shape. Flag it and recommend making the return value static where practical, or documenting the stable subset only if that matches existing project practice.
- If the method delegates to `array_merge()` or another helper, inspect enough context to determine the final shape. If that is not deterministic, report the uncertainty.

## Attribute Matching Rules

- Find attribute methods by return type, not by method name. A model attribute method normally has `protected function attributeName(): Attribute`.
- Treat `Attribute::make(...)` and `new Attribute(...)` as equivalent for this review.
- If only `get:` is present, require the set generic to be `never`.
- If only `set:` is present, require the get generic to be `never`.
- If both `get:` and `set:` are present, require both generics to match their respective closure types.
- If a getter closure has an explicit return type, use that as the get generic unless the body proves it wrong.
- If a setter closure has an explicit parameter type, use that as the set generic unless the body proves it wrong.
- If a setter returns an array of attributes, the set generic describes the accepted input value, not the returned storage array.
- If closures omit types, infer conservatively from the returned expression, model casts, database shape, and call sites. Flag uncertain cases instead of inventing overly precise generics.
- Prefer `never` over `null` for the missing generic side. Use nullable types only when the getter or setter actually accepts or returns null, such as `Attribute<?string, ?string>`.
- Preserve existing shorthand built-in types where valid: `string`, `int`, `float`, `bool`, `array`, `mixed`, `never`, and array shapes.

## Relation Pattern

Use this shape for model relationship methods:

```php
/**
 * @return HasMany<\App\Models\Post, $this>
 */
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

/**
 * @return BelongsTo<\App\Models\User, $this>
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

/**
 * @return MorphTo<\Illuminate\Database\Eloquent\Model, $this>
 */
public function imageable(): MorphTo
{
    return $this->morphTo();
}
```

## Relation Matching Rules

- Find relationship methods by explicit return type from `Illuminate\Database\Eloquent\Relations`, not by method name.
- Relationship methods should be `public`; Laravel relationship methods are intended to be called for query chaining, eager-load constraints, and dynamic property access.
- Require a PHPDoc `@return` generic for every relationship return type.
- The PHPDoc relationship class must match the PHP return type.
- For direct relationships, require the first generic to match the related model class passed to the relationship builder.
- For inverse relationships such as `belongsTo(User::class)`, the first generic is the parent or related model, not the declaring model.
- For polymorphic inverse relationships using `morphTo()` with no explicit class argument, use the narrowest known related model union if the codebase establishes one; otherwise use `\Illuminate\Database\Eloquent\Model`.
- For through relationships, preserve the framework relation's generic arity expected by the installed Larastan version. If unsure, inspect existing project examples or run PHPStan after the change instead of guessing.
- Prefer `$this` for the declaring model generic unless local PHPStan feedback requires a concrete fully qualified model type.
- Use fully qualified model class names in PHPDoc generics, for example `HasMany<\App\Models\Post, $this>`, even when the PHP body uses imported class names.
- If a relationship delegates to another method, macro, or conditional relation builder, report uncertainty instead of inventing a generic.

## Fix Guidance

- Keep edits scoped to model `casts()` methods, `Attribute` methods, relationship methods, and their PHPDocs unless the user requested broader cleanup.
- Do not rewrite legacy `$casts` properties unless the task specifically asks for that migration.
- Preserve existing ordering and style where possible.
- Use imported class names in the PHP return array if that is the file's existing style, but write fully qualified class-name strings in the PHPDoc array shape.
- After PHP edits, run the project's formatter and the smallest relevant static-analysis or test command required by local instructions.

## Review Output

When reporting findings, lead with actionable issues:

- File and line reference for the `casts()`, `Attribute`, or relationship method.
- Which rule failed: visibility, missing shape, missing generic, key mismatch, type mismatch, non-FQCN class name, missing `never`, generic relation mismatch, or non-deterministic return.
- The expected PHPDoc shape or a concise patch summary.
- Verification commands run, or why verification could not run.
