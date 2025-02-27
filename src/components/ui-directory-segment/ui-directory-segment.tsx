import { Component, Host, Prop, State, Method, h } from '@stencil/core'

@Component({
  tag: 'ui-directory-segment',
  styleUrl: 'ui-directory-segment.css',
  shadow: true,
})
export class UiDirectorySegment {
  /**
   * Internal property to store the parsed data.
   *
   * @type {unknown | null}
   * @default null
   */
  private _data: unknown | null = null

  /**
   * A unique identifier for the segment.
   *
   * @type {string}
   */
  @Prop() mark!: string

  /**
   * Data to be used within the expansion panel.
   *
   * @type {string | null}
   * @default null
   */
  @Prop() data: string | null = null

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
   * Retrieves the parsed data associated with this segment.
   *
   * @returns {Promise<unknown | null>} A promise that resolves to the parsed data or null
   */
  @Method()
  async getData(): Promise<unknown | null> {
    return this._data
  }

  /**
   * Parses the provided JSON string data.
   */
  private parseData(data: string | null): void {
    if (data) {
      try {
        this._data = JSON.parse(data)
      } catch (error) {
        console.warn(`Failed to parse data for segment ${this.mark}:`, error)
        this._data = null
      }
    } else {
      this._data = null
    }
  }

  /**
   * Lifecycle method that is called once before the component loads.
   */
  componentWillLoad() {
    if (!this.mark) {
      console.error('The "mark" property is required for ui-directory-segment')
    }

    this.parseData(this.data)
  }

  /**
   * Renders the component.
   */
  render() {
    return (
      <Host
        class={this.active ? 'active' : ''}
        role="tab"
        aria-selected={this.active ? 'true' : 'false'}
      >
        <slot />
      </Host>
    )
  }
}
