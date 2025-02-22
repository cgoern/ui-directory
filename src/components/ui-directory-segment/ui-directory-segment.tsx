import { Component, Host, h } from '@stencil/core'

@Component({
  tag: 'ui-directory-segment',
  styleUrl: 'ui-directory-segment.css',
  shadow: true,
})
export class UiDirectorySegment {
  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }
}
