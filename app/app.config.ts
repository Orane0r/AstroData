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
        root: 'border-b-0 px-5'
      }
    }
  }
})
