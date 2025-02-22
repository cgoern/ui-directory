import { Component, Host, Element, Prop, State, Watch, h } from '@stencil/core'

@Component({
  tag: 'ui-directory-collection',
  styleUrl: 'ui-directory-collection.css',
  shadow: true,
})
export class UiDirectoryCollection {
  private segments: HTMLUiDirectorySegmentElement[] = []

  @Prop() alignX: ScrollIntoViewOptions['inline'] = 'center'
  @Prop() alignY: ScrollIntoViewOptions['block'] = 'start'
  @Prop() behavior: ScrollIntoViewOptions['behavior'] = 'smooth'
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
      requestAnimationFrame(() => {
        segmentNew.scrollIntoView({
          behavior: segmentOld ? this.behavior : 'instant',
          inline: this.alignX,
          block: this.alignY,
        })
      })
    } catch (error) {
      console.error('Error setting segments:', error)
    }
  }

  componentWillLoad() {
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

  private getMarkAttributes(segment: HTMLUiDirectorySegmentElement) {
    const isActive = segment === this.activeSegment

    return {
      class: `mark ${isActive ? 'active' : ''}`,
      part: `mark ${isActive ? 'active' : ''}`,
    }
  }

  render() {
    return (
      <Host>
        <div part="marks" class="marks">
          {this.segments.map((segment, index) => (
            <div
              key={index}
              onClick={() => this.handleMarkClick(segment)}
              {...this.getMarkAttributes(segment)}
            >
              {segment.mark}
            </div>
          ))}
        </div>
        <div part="segments" class="segments">
          <slot />
        </div>
      </Host>
    )
  }
}
