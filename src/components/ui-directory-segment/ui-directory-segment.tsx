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
  async activate(): Promise<void> {
    this.active = true
  }

  @Method()
  async deactivate(): Promise<void> {
    this.active = false
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }
}
