<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot/>
  </component>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    },
    externalLink: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    linkProps(url) {
      if (this.externalLink) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
