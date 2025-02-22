import { Component, Host, Prop, Method, h } from '@stencil/core'

@Component({
  tag: 'ui-directory-segment',
  styleUrl: 'ui-directory-segment.css',
  shadow: true,
})
export class UiDirectorySegment {
  @Prop() mark!: string
  @Prop({ reflect: true, mutable: true }) active: boolean = false

  @Method()
  async setActive(active: boolean = true): Promise<void> {
    this.active = active
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }
}
