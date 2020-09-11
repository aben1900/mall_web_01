<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const {icon, title} = context.props
    const vnodes = []

    if (icon) {
      if (typeof icon === 'string') {
        // eslint-disable-next-line
        vnodes.push(< svg - icon
      icon - class = {icon}
      />)
      } else {
        // eslint-disable-next-line
        vnodes.push(< svg - icon
      icon - class = 'people' / >
      )
        // vnodes.push(<svg viewBox={icon.viewBox}><use xlinkHref={'#' + icon.id}/></svg>)
      }
      }

      if (title) {
      vnodes.push( <
        span
        slot = 'title' > {(title)
      }
        <
          /span>)
          }
          return vnodes
          }
}
</script>
