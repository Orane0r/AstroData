export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'purple',
      neutral: 'slate'
    },
    pageHero: {
      slots: {
        title: 'font-display'
      }
    },
    pageHeader: {
      slots: {
        root: 'border-b-0 p-5'
      }
    },
    pageBody: {
      base: 'px-5'
    },
    table: {
      slots: {
        th: 'text-center uppercase'
      }
    }
  }
})
