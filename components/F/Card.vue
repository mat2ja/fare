<script lang="ts" setup>
const props = defineProps<{
  paddingless?: boolean
  filled?: boolean
  white?: boolean
  neobrutal?: boolean
}>()

const backgroundStyle = computed(() => {
  if (props.white) {
    return 'bg-white dark:bg-zinc-9'
  }
  return props.filled
    ? 'bg-zinc-1 dark:bg-zinc-8 border-transparent'
    : 'bg-transparent border-zinc-2 dark:border-zinc-8'
})
</script>

<template>
  <article
    border="rounded-md 2" border-base
    class="transition-shadow text-color-base"
    :class="[
      paddingless ? 'p-0' : 'p-5',
      backgroundStyle,
      { neobrutal },
    ]"
  >
    <slot />
  </article>
</template>

<style scoped>
.neobrutal {
  box-shadow: 6px 6px 0 #e4e4e7;
}
.dark .neobrutal {
  box-shadow: 6px 6px 0 #27272a;
}
</style>
