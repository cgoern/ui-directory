import { Component, Host, Element, Prop, State, Watch, h } from '@stencil/core'

interface MarksObservable {
  activated: HTMLDivElement
  preceding: HTMLDivElement
  following: HTMLDivElement
}

@Component({
  tag: 'ui-directory-collection',
  styleUrl: 'ui-directory-collection.css',
  shadow: true,
})
export class UiDirectoryCollection {
  private animationFrameInstance: number | null = null
  private segments: HTMLUiDirectorySegmentElement[] = []
  private interacted: boolean = false
  private marks: HTMLDivElement[] = []
  private marksObserver: IntersectionObserver
  private marksObservable: MarksObservable

  @Element() element!: HTMLUiDirectoryCollectionElement

  @Prop() alignX: ScrollIntoViewOptions['inline'] = 'center'
  @Prop() alignY: ScrollIntoViewOptions['block'] = 'start'
  @Prop() behavior: ScrollIntoViewOptions['behavior'] = 'smooth'

  @State() activeSegment: HTMLUiDirectorySegmentElement

  @Watch('activeSegment')
  async watchActiveSegment(
    segmentNew: HTMLUiDirectorySegmentElement,
    segmentOld: HTMLUiDirectorySegmentElement,
  ) {
    try {
      const segmentNewIndex = this.segments.indexOf(segmentNew)

      if (segmentOld) {
        await segmentOld.deactivate()
      }

      await segmentNew.activate()

      requestAnimationFrame(() => {
        this.setMarksObservable(segmentNewIndex)

        segmentNew.scrollIntoView({
          behavior: this.interacted ? this.behavior : 'instant',
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

    this.marksObserver = new IntersectionObserver(
      (elements) => {
        elements.forEach((element) => {
          if (!element.isIntersecting) {
            this.scrollMarks()
          }
        })
      },
      {
        threshold: 1.0,
      },
    )
  }

  componentDidLoad() {
    const segmentActiveIndex = this.segments.indexOf(this.activeSegment)

    this.marks = Array.from(this.element.shadowRoot.querySelectorAll('.mark'))
    this.setMarksObservable(segmentActiveIndex)
  }

  private setMarksObservable(index: number): void {
    this.marksObservable = {
      activated: this.marks[index],
      preceding: this.marks[index - 1],
      following: this.marks[index + 1],
    }

    Object.values(this.marksObservable).forEach((mark) => {
      if (mark) {
        this.marksObserver.observe(mark)
      }
    })
  }

  disconnectedCallback() {
    this.marksObserver.disconnect()

    if (this.animationFrameInstance !== null) {
      cancelAnimationFrame(this.animationFrameInstance)
    }
  }

  private scrollMarks(): void {
    this.marksObserver.disconnect()

    requestAnimationFrame(() => {
      const { activated } = this.marksObservable

      if (activated) {
        activated.scrollIntoView({
          behavior: this.interacted ? this.behavior : 'instant',
          inline: this.alignX,
          block: this.alignY,
        })
      }
    })
  }

  private handleMarkClick = (segment: HTMLUiDirectorySegmentElement): void => {
    if (this.activeSegment !== segment) {
      this.activeSegment = segment

      if (!this.interacted) {
        this.interacted = true
      }
    }
  }

  private getMarkAttributes(segment: HTMLUiDirectorySegmentElement): Record<string, string> {
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
