<script lang="ts" setup>
const sidebar = useSidebar()

const {
  isLoading: isNetWorthLoading,
  formattedNetWorth,
  netWorth,
} = useNetWorth()
</script>

<template>
  <div
    absolute
    inset-0
    h-screen
    overflow-y-auto
    pt-4
    font-mono
    bg="white dark:zinc-9"
    border="r-0 md:r-2"
    border-base
    flex="~ col gap-6"
  >
    <div
      flex
      items-center
      justify-between
      mt-2
      px-6
    >
      <NuxtLink to="/">
        <FLogo size="lg" />
      </NuxtLink>
      <button
        lt-md:block
        hidden
        grid
        content-center
        p-2
        class="translate-x-2"
      >
        <Icon
          name="tabler:x"
          text="2xl"
          @click="sidebar.close()"
        />
      </button>
    </div>

    <SidebarNavList flex-1 />

    <div
      bg="zinc-1 dark:zinc-8/40"
      border="t-2"
      border-base
    >
      <div
        flex="~ col gap-0.5"
        p="4 t-5 y-3"
      >
        <p
          text="xs zinc-4"
          font="sans medium"
          uppercase
        >
          Net worth
        </p>
        <div
          flex
          gap-2
          items-center
        >
          <FSkeleton
            v-if="isNetWorthLoading"
            class="h-30px w-30"
            m="t-0.5 b-1"
          />
          <p
            v-else-if="netWorth"
            text-3xl
            font-display
            font-medium
          >
            {{ formattedNetWorth }}
          </p>
          <p
            v-else
            text-3xl
            font-display
            font-medium
          >
            {{ formatCurrency(0) }}
          </p>
        </div>
      </div>

      <SidebarControls
        py-4
        max-w="fit"
        mx-auto
      />
    </div>
  </div>
</template>
