<script setup>
const isDialogShown = ref(false)

const context = `
本系统中获取会话令牌的方法主要基于<a font-bold href="https://github.com/ZekeSnider/NintendoSwitchRESTAPI" target="_blank"> NintendoSwitchRESTAPI </a>提供的源代码。无法保证它完全安全且没有任何风险。

用户应该知道，使用任何第三方工具来获取会话标记可能违反任天堂的用户协议，账户可能会被终止或暂停。因此，用户应该自担风险使用此类工具，并了解潜在的后果。

在此声明，本人不对使用此方法获取会话令牌而导致的任何问题或损害承担任何责任。用户承担使用此方法的所有责任和风险。

继续使用本系统和此处提供的方法，即表示您已知悉并同意此免责声明。
`
</script>

<template>
  <div w-full cursor-pointer text-center underline decoration-dashed op-50 style="text-underline-offset:.3em;" @click="isDialogShown = !isDialogShown">
    免责声明
  </div>
  <ADialog
    v-model="isDialogShown"
    style="white-space: pre-line;"
    title="免责声明"
  >
    <template #default>
      <div px-4 pb-4 class="-mt-7" v-html="context" />
    </template>
  </ADialog>
</template>
