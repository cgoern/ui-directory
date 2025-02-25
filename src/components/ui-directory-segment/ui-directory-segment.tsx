import { Component, Host, Prop, State, Method, h } from '@stencil/core'

@Component({
  tag: 'ui-directory-segment',
  styleUrl: 'ui-directory-segment.css',
  shadow: true,
})
export class UiDirectorySegment {
  /**
   * A unique identifier for the segment.
   *
   * @type {string}
   */
  @Prop() mark!: string

  /**
   * Indicates whether the segment is active.
   *
   * @type {boolean}
   * @default false
   */
  @State() active: boolean = false

  /**
   * Activates the segment by setting the `active` property to true.
   *
   * @returns {Promise<void>}
   */
  @Method()
  async activate(): Promise<void> {
    this.active = true
  }

  /**
   * Deactivates the segment by setting the `active` property to false.
   *
   * @returns {Promise<void>}
   */
  @Method()
  async deactivate(): Promise<void> {
    this.active = false
  }

  /**
   * Renders the component.
   */
  render() {
    return (
      <Host class={this.active ? 'active' : ''}>
        <slot />
      </Host>
    )
  }
}
