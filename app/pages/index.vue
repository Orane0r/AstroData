<template>
  <div>
    <UPageHero
      description="Explorez et comparez les objets de notre univers."
      orientation="horizontal"
      :links="[{
        label: 'Commencer',
        icon: 'i-lucide-rocket',
        to: '/catalog',
        size: 'xl'
      }]"
    >
      <template #title>
        Le cosmos,<br>
        <span class="bg-linear-to-r from-primary-500 to-secondary-300 bg-clip-text text-transparent">
          en données.
        </span>
      </template>

      <div class="relative">
        <!-- Rings -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="absolute rounded-full border border-white/10 w-35 h-35" />
          <div class="absolute rounded-full border border-white/10 w-60 h-60" />
          <div class="absolute rounded-full border border-white/10 w-85 h-85" />
          <div class="absolute rounded-full border border-white/10 w-107.5 h-107.5" />
        </div>

        <!-- Sun -->
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             w-22.5 h-22.5 rounded-full
             bg-[radial-gradient(circle_at_40%_35%,#ffd68a,#f7931e_60%,#c9660b_100%)]
             shadow-[0_0_60px_20px_rgba(247,147,30,0.35)]"
        />

        <!-- Planets -->
        <div class="absolute inset-0 flex items-center justify-center animate-orbit-faster">
          <div
            class="absolute left-1/2 -translate-x-1/2 -translate-y-17.5
               w-3.5 h-3.5 rounded-full
               bg-[radial-gradient(circle_at_35%_30%,#eee,#999)]"
          />
        </div>
        <div class="absolute inset-0 flex items-center justify-center animate-orbit-fast">
          <div
            class="absolute left-1/2 -translate-x-1/2  -translate-y-30
               w-5 h-5 rounded-full
               bg-[radial-gradient(circle_at_35%_30%,#ffe9b0,#d9a441)]"
          />
        </div>
        <div class="absolute inset-0 flex items-center justify-center animate-orbit-medium">
          <div
            class="absolute left-1/2 -translate-x-1/2 -translate-y-42.5
               w-5.5 h-5.5 rounded-full
               bg-[radial-gradient(circle_at_35%_30%,#9fd4ff,#2f7fd1)]"
          />
        </div>
        <div class="absolute inset-0 flex items-center justify-center animate-orbit-slow">
          <div
            class="absolute left-1/2 -translate-x-1/2 -translate-y-53.75
               w-4 h-4 rounded-full
               bg-[radial-gradient(circle_at_35%_30%,#ff9d6c,#d9531f)]"
          />
        </div>
      </div>
    </UPageHero>
  </div>
</template>
