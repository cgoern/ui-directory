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

  /**
   * The host element.
   *
   * @type {HTMLUiDirectoryCollectionElement}
   */
  @Element() element!: HTMLUiDirectoryCollectionElement

  /**
   * Horizontal alignment for scrolling into view.
   *
   * @type {ScrollIntoViewOptions['inline']}
   * @default 'center'
   */
  @Prop() alignX: ScrollIntoViewOptions['inline'] = 'center'

  /**
   * Vertical alignment for scrolling into view.
   *
   * @type {ScrollIntoViewOptions['block']}
   * @default 'start'
   */
  @Prop() alignY: ScrollIntoViewOptions['block'] = 'start'

  /**
   * Scroll behavior for scrolling into view.
   *
   * @type {ScrollIntoViewOptions['behavior']}
   * @default 'smooth'
   */
  @Prop() behavior: ScrollIntoViewOptions['behavior'] = 'smooth'

  /**
   * The currently active segment.
   *
   * @type {HTMLUiDirectorySegmentElement}
   */
  @State() activeSegment: HTMLUiDirectorySegmentElement

  /**
   * Watcher for changes to the active segment.
   *
   * @param {HTMLUiDirectorySegmentElement} segmentNew - The new active segment.
   * @param {HTMLUiDirectorySegmentElement} segmentOld - The previous active segment.
   * @returns {Promise<void>}
   */
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

  /**
   * Lifecycle method that runs before the component is loaded.
   */
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

  /**
   * Lifecycle method that runs after the component has loaded.
   */
  componentDidLoad() {
    const segmentActiveIndex = this.segments.indexOf(this.activeSegment)

    this.marks = Array.from(this.element.shadowRoot.querySelectorAll('.mark'))
    this.setMarksObservable(segmentActiveIndex)
  }

  /**
   * Sets the observable marks based on the active segment index.
   *
   * @param {number} index - The index of the active segment.
   */
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

  /**
   * Lifecycle method that runs when the component is disconnected.
   */
  disconnectedCallback() {
    this.marksObserver.disconnect()

    if (this.animationFrameInstance !== null) {
      cancelAnimationFrame(this.animationFrameInstance)
    }
  }

  /**
   * Scrolls the marks into view.
   */
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

  /**
   * Handles the click event on a mark.
   *
   * @param {HTMLUiDirectorySegmentElement} segment - The segment associated with the clicked mark.
   */
  private handleMarkClick = (segment: HTMLUiDirectorySegmentElement): void => {
    if (this.activeSegment !== segment) {
      this.activeSegment = segment

      if (!this.interacted) {
        this.interacted = true
      }
    }
  }

  /**
   * Gets the attributes for a mark element.
   *
   * @param {HTMLUiDirectorySegmentElement} segment - The segment associated with the mark.
   * @returns {Record<string, string>} The attributes for the mark element.
   */
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
