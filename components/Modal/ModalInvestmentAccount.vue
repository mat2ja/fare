<script lang="ts" setup>
import type { Prisma } from '@prisma/client'
import { get, set } from '@vueuse/core'
import type { InvestmentType } from '~~/models/enums'

const modal = useInvestmentAccountModal()

const form = $computed(() => modal.form)

const accountId = toRef(modal, 'accountId')
const investmentAccountId = toRef(modal, 'investmentAccountId')

const { mutate: createAccount, isLoading: isCreateLoading, isError: isErrorCreate, reset: resetCreate } = useInvestmentAccountCreate()
const { mutate: updateAccount, isLoading: isUpdateLoading, isError: isErrorUpdate, reset: resetUpdate } = useInvestmentAccountUpdate(investmentAccountId)
const { mutate: deleteAccount, isLoading: isDeleteLoading, isError: isErrorDelete, reset: resetDelete } = useAccountDelete(accountId)

const hasError = computed(() => get(isErrorCreate) || get(isErrorUpdate) || get(isErrorDelete))

const { allIcons: icons } = useIcons()
const { colorOptions: colors } = useAppColors()

const createAccountHandler = async (values: Prisma.MoneyAccountUncheckedCreateWithoutUserInput & Prisma.InvestmentAccountUncheckedCreateInput) => {
  const { description, expectedRateOfReturn, type, ...accountData } = values

  const investmentAccountData = { description, expectedRateOfReturn, type }
  const { userId } = $(useAuth())

  if (userId) {
    const account = { ...accountData, userId }
    createAccount({ account, ...investmentAccountData }, {
      onSuccess: () => modal.hide(),
    })
  }
}

const editAccountHandler = async (values: Prisma.MoneyAccountUncheckedUpdateWithoutUserInput & Prisma.InvestmentAccountUncheckedUpdateInput) => {
  const { userId } = $(useAuth())
  const { description, expectedRateOfReturn, type, ...accountData } = values
  const investmentAccountData = { description, expectedRateOfReturn, type }
  const account = { ...accountData, userId }

  if (userId) {
    updateAccount({ account, ...investmentAccountData }, {
      onSuccess: () => modal.hide(),
    })
  }
}

const deleteAccountHandler = async () => {
  const { userId } = $(useAuth())

  if (userId) {
    deleteAccount({ userId }, {
      onSuccess: () => {
        modal.hide()
        const route = useRoute()
        if (route.name === 'accounts-accountId') {
          navigateTo({ name: 'accounts' })
        }
      },
    })
  }
}

const onSubmit = form.handleSubmit((values) => {
  if (modal.isEdit) {
    editAccountHandler(values)
  } else {
    // TODO: fix type error
    createAccountHandler(values)
  }
}, (err) => {
  console.error('Error submitting form', err)
})

const resetQueries = () => {
  resetCreate()
  resetUpdate()
  resetDelete()
}

const onClose = () => {
  modal.reset()
  resetQueries()
}

const deleteBtn = ref<HTMLElement | null>(null)
const longPressedHook = ref(false)

const onLongPressCallbackHook = () => {
  set(longPressedHook, true)
  deleteAccountHandler()
}

onLongPress(
  deleteBtn,
  onLongPressCallbackHook,
  {
    modifiers: { prevent: true },
    delay: 1000,
  },
)

const modalConfig = computed(() => ({
  title: 'Investment account',
  description: modal.isEdit ? 'Edit a investment account' : 'Create a new investment account',
  closable: true,
  panelClass: 'w-full !sm:min-w-xl',
}))

const typeOptions: { label: InvestmentType; value: string; icon: string }[] = [
  { label: 'Stocks', value: 'Stocks', icon: 'tabler:chart-line' },
  { label: 'Crypto', value: 'Crypto', icon: 'tabler:coin-bitcoin' },
  { label: 'Property', value: 'Property', icon: 'tabler:building-community' },
  { label: 'Other', value: 'Other', icon: 'tabler:square-asterisk' },
]
</script>

<template>
  <ModalBase
    v-model="modal.opened"
    v-bind="modalConfig"
    @close="onClose"
  >
    <FAlert v-if="hasError" type="error" mb-3>
      <div>
        <p>Something went wrong</p>
        <ul class="list-disc pl-3.5 mt-2">
          <li v-if="isErrorUpdate" text-sm font-normal>
            You probably did not change any information
          </li>
          <li v-if="isErrorCreate || isErrorUpdate" text-sm font-normal>
            Account with the same name may already exists
          </li>
        </ul>
      </div>
    </FAlert>

    <form flex flex-col gap-3 @submit.prevent="onSubmit">
      <FInput
        v-model="form.values.name"
        label="Name"
        icon="tabler:text-size"
        placeholder="Account name"
        :invalid="!!form.errors.name"
        :error="form.errors.name"
      />

      <FTextarea
        v-model="form.values.description"
        icon="tabler:text-plus"
        label="Description"
        placeholder="What is this account for?"
        :invalid="!!form.errors.description"
        :error="form.errors.description"
      />

      <div flex gap-2>
        <FSelectField
          v-model:value="form.values.type"
          flex-1
          block
          placeholder="Select investment type"
          label="Type"
          icon="tabler:moneybag"
          :items="typeOptions"
          :invalid="!!form.errors.type"
          :error="form.errors.type"
        >
          <template #selected="{ item }">
            <div flex items-center gap-4>
              <span>{{ item.label }}</span>
            </div>
          </template>
          <template #option="{ item }">
            <div flex items-center gap-4>
              <Icon :icon="item.icon" />
              <span>{{ item.label }}</span>
            </div>
          </template>
        </FSelectField>

        <FInput
          v-model="form.values.expectedRateOfReturn"
          flex-1
          icon="tabler:percentage"
          type="number"
          label="Rate of return"
          placeholder="ex 9%"
          :input-props="{ min: 0.1, step: 0.01 }"
          :invalid="!!form.errors.expectedRateOfReturn"
          :error="form.errors.expectedRateOfReturn"
          hint="Predicted yearly return of your investment"
        />
      </div>

      <div flex flex-col md:flex-row gap-3>
        <FSelectField
          v-model:value="form.values.color"
          :invalid="!!form.errors.color"
          :error="form.errors.color"
          block flex-1
          label="Color"
          :items="colors"
        >
          <template #selected="{ item }">
            <div flex items-center gap-4>
              <span
                w="4.5" h="4.5" flex-shrink-0 aspect-square rounded-full
                :class="item?.bg"
              />
              <span>{{ item.label }}</span>
            </div>
          </template>
          <template #option="{ item }">
            <div flex items-center gap-4>
              <span
                w="4.5" h="4.5" flex-shrink-0 aspect-square rounded-full
                :class="item.bg"
              />
              <span>{{ item.label }}</span>
            </div>
          </template>
        </FSelectField>

        <FSelectField
          v-model:value="form.values.icon"
          :items="icons"
          :invalid="!!form.errors.icon"
          :error="form.errors.icon"
          label="Icon"
          block flex-1
        >
          <template #selected="{ item }">
            <div flex items-center gap-4 justify-between>
              <Icon :name="item.value" />
              <p opacity-40 text-sm line-clamp-1>
                {{ (item.value as string).split(':').at(-1) }}
              </p>
            </div>
          </template>
          <template #option="{ item }">
            <div flex items-center gap-4 justify-between>
              <Icon :name="item.value" />
              <p opacity-40 text-sm line-clamp-1>
                {{ (item.value as string).split(':').at(-1) }}
              </p>
            </div>
          </template>
        </FSelectField>
      </div>

      <div flex justify-end gap-2 mt-4>
        <FButton type="button" variant="subtle" @click="modal.hide()">
          Cancel
        </FButton>

        <FTooltip content="Hold to delete" placement="bottom">
          <FButton
            v-if="modal.isEdit"
            ref="deleteBtn"
            :disabled="isUpdateLoading || isCreateLoading"
            :loading="isDeleteLoading"
            type="button"
            variant="danger"
            icon="tabler:x"
          >
            Delete
          </FButton>
        </FTooltip>

        <FButton
          v-if="modal.isEdit"
          type="submit"
          icon="tabler:edit"
          :loading="isUpdateLoading"
        >
          Edit
        </FButton>
        <FButton
          v-if="modal.isCreate"
          type="submit"
          icon="tabler:plus"
          :loading="isCreateLoading"
        >
          Create
        </FButton>
      </div>
    </form>
  </ModalBase>
</template>
