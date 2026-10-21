# @enovaui/lupa-tokens

C header design tokens for the LUPA platform.

The JSON files in this repository are the source data for the generated headers. The published package intentionally contains only the public `include` directory and package documentation; token JSON files are not included in the package tarball.

## Usage

Include the primitive header and one semantic theme header:

```c
#include <lupa_tokens/color_primitive.h>
#include <lupa_tokens/color_semantic_dark_blue.h>

uint32_t background = TOKEN_COLOR_BACKGROUND_DEFAULT;
```

Each semantic header also exposes an X-macro list. The list can be expanded to build a runtime table without duplicating the token names:

```c
#define LUPA_TOKENS_DISABLE_CONVENIENCE_CONSTANTS
#include <lupa_tokens/color_semantic_dark_blue.h>
#include <lupa_tokens/color_semantic_light_blue.h>
#undef LUPA_TOKENS_DISABLE_CONVENIENCE_CONSTANTS

#define X(name, value, semantic_name, primitive_name) TOKEN_ID_##name,
enum token_id {
    SEMANTIC_DARK_BLUE_TOKEN_LIST(X)
    TOKEN_ID_COUNT
};
#undef X

#define X(name, value, semantic_name, primitive_name) \
    { TOKEN_ID_##name, value, semantic_name },
static const struct token_entry dark_tokens[] = {
    SEMANTIC_DARK_BLUE_TOKEN_LIST(X)
};
#undef X
```

## Runtime theme switching

The `TOKEN_*` convenience constants are compile-time values. They are suitable when one theme is selected at build time, but they do not change when the theme changes at runtime.

For runtime switching, include all required theme headers with convenience constants disabled, then build one table per theme in a LUPA adapter. The following example uses the blue themes; the orange themes can be added in the same way.

```c
/* lupa_theme.c - keep these definitions in one C source file. */
#include <stdint.h>

#define LUPA_TOKENS_DISABLE_CONVENIENCE_CONSTANTS
#include <lupa_tokens/color_semantic_dark_blue.h>
#include <lupa_tokens/color_semantic_light_blue.h>
#undef LUPA_TOKENS_DISABLE_CONVENIENCE_CONSTANTS

typedef enum {
#define LUPA_DECLARE_TOKEN_ID(name, value, semantic_name, primitive_name) \
    TOKEN_ID_##name,
    SEMANTIC_DARK_BLUE_TOKEN_LIST(LUPA_DECLARE_TOKEN_ID)
#undef LUPA_DECLARE_TOKEN_ID
    TOKEN_ID_COUNT
} lupa_token_id_t;

typedef struct {
    uint32_t value;
    const char *semantic_name;
} lupa_color_token_t;

#define LUPA_DECLARE_TOKEN_ENTRY(name, value, semantic_name, primitive_name) \
    [TOKEN_ID_##name] = { value, semantic_name },

static const lupa_color_token_t dark_blue_tokens[TOKEN_ID_COUNT] = {
    SEMANTIC_DARK_BLUE_TOKEN_LIST(LUPA_DECLARE_TOKEN_ENTRY)
};

static const lupa_color_token_t light_blue_tokens[TOKEN_ID_COUNT] = {
    SEMANTIC_LIGHT_BLUE_TOKEN_LIST(LUPA_DECLARE_TOKEN_ENTRY)
};

#undef LUPA_DECLARE_TOKEN_ENTRY

typedef enum {
    LUPA_THEME_DARK_BLUE,
    LUPA_THEME_LIGHT_BLUE
} lupa_theme_t;

static const lupa_color_token_t *active_tokens = dark_blue_tokens;

void lupa_set_theme(lupa_theme_t theme)
{
    active_tokens = theme == LUPA_THEME_LIGHT_BLUE
        ? light_blue_tokens
        : dark_blue_tokens;
}

uint32_t lupa_get_color(lupa_token_id_t token_id)
{
    if ((unsigned) token_id >= TOKEN_ID_COUNT) {
        return 0;
    }
    return active_tokens[token_id].value;
}
```

Application code can then switch themes without changing the token ID:

```c
lupa_set_theme(LUPA_THEME_LIGHT_BLUE);
uint32_t background = lupa_get_color(TOKEN_ID_COLOR_BACKGROUND_DEFAULT);
```

This example assumes that every theme contains the same semantic token names and therefore shares the same `lupa_token_id_t` enum. If theme switching can happen across threads, protect `active_tokens` with the synchronization mechanism used by the LUPA runtime.

Color values use `0xRRGGBB`. If a source color includes alpha, the generated header uses `0xAARRGGBB`. Opacity values are represented as normalized `float` constants in the range `0.0f` to `1.0f`.

Headers are generated from the repository root with:

```bash
pnpm build:lupa
```

To fetch the configured LUPA Figma library first:

```bash
pnpm sync:lupa
pnpm build:lupa
```
