import { Component, Host, Element, State, Watch, h } from '@stencil/core'

@Component({
  tag: 'ui-directory-collection',
  styleUrl: 'ui-directory-collection.css',
  shadow: true,
})
export class UiDirectoryCollection {
  private segments: HTMLUiDirectorySegmentElement[] = []

  @Element() element!: HTMLUiDirectoryCollectionElement
  @State() activeSegment: HTMLUiDirectorySegmentElement

  @Watch('activeSegment')
  async watchActiveSegment(
    segmentNew: HTMLUiDirectorySegmentElement,
    segmentOld: HTMLUiDirectorySegmentElement,
  ) {
    try {
      if (segmentOld) {
        await segmentOld.setActive(false)
      }
      await segmentNew.setActive()
    } catch (error) {
      console.error('Error setting segments:', error)
    }
  }

  componentDidLoad() {
    this.segments = Array.from(this.element.querySelectorAll('ui-directory-segment'))

    const activeSegment = this.segments.find((segment) => segment.active)

    if (activeSegment) {
      this.activeSegment = activeSegment
    } else if (this.segments.length > 0) {
      this.activeSegment = this.segments[0]
    }
  }

  private handleMarkClick = (segment: HTMLUiDirectorySegmentElement) => {
    if (this.activeSegment !== segment) {
      this.activeSegment = segment
    }
  }

  render() {
    return (
      <Host>
        <div class="marks">
          {this.segments.map((segment, index) => (
            <div
              key={index}
              class={`mark ${segment === this.activeSegment ? 'active' : ''}`}
              onClick={() => this.handleMarkClick(segment)}
            >
              {segment.mark}
            </div>
          ))}
        </div>
        <div class="segments">
          <slot />
        </div>
      </Host>
    )
  }
}
