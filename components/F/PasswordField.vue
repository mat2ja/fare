<script setup lang="ts">
type Props = {
  modelValue?: string
  type?: string
  icon?: string
  iconPlacement?: 'left' | 'right'
  loading?: boolean
  disabled?: boolean
  readonly?: boolean
}

type Emits = {
  (e: 'input', value?: string): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'update:modelValue', value?: string): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  iconPlacement: 'left',
})
const emit = defineEmits<Emits>()

const visible = ref(false)
const toggleVisible = useToggle(visible)

const value = computed({
  get: () => props.modelValue ?? '',
  set: (val: string) => emit('update:modelValue', val),
})

const emits = {
  input: (e: Event) => emit('input', (e.target as HTMLInputElement).value),
  focus: () => emit('focus'),
  blur: () => emit('blur'),
}
</script>

<template>
  <FInput
    v-model="value"
    v-bind="$props"
    :type="visible ? 'text' : 'password'"
    icon-placement="right"
    v-on="emits"
  >
    <template #right>
      <button grid content-center @click="toggleVisible()">
        <Icon v-show="visible" name="tabler:eye-off" />
        <Icon
          v-show="!visible"
          name="tabler:eye"
        />
      </button>
    </template>
  </FInput>
</template>
