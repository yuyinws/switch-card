import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetAnu } from 'anu-vue'
import { presetThemeDefault } from '@anu-vue/preset-theme-default'

export default defineConfig({
  include: [/.*\/anu-vue\.js(.*)?$/, './**/*.vue', './**/*.md'],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
    // anu-vue preset
    presetAnu(),

    // default theme preset
    presetThemeDefault(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
