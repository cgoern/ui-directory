import { Component, Host, h } from '@stencil/core'

@Component({
  tag: 'ui-directory-collection',
  styleUrl: 'ui-directory-collection.css',
  shadow: true,
})
export class UiDirectoryCollection {
  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }
}
