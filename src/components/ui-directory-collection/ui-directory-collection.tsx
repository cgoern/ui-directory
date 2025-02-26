import { Component, Host, Element, Prop, State, Watch, h } from '@stencil/core'

interface MarksObservable {
  preceding: HTMLDivElement
  following: HTMLDivElement
}

@Component({
  tag: 'ui-directory-collection',
  styleUrl: 'ui-directory-collection.css',
  shadow: true,
})
export class UiDirectoryCollection {
  /**
   * An instance of the animation frame, used to manage and cancel animation frames.
   *
   * @type {number | null}
   */
  private animationFrameInstance: number | null = null

  /**
   * An array of segments within the collection.
   *
   * @type {HTMLUiDirectorySegmentElement[]}
   */
  private segments: HTMLUiDirectorySegmentElement[] = []

  /**
   * The container element for the segments.
   *
   * @type {HTMLDivElement}
   */
  private segmentsContainer!: HTMLDivElement

  /**
   * An array of mark elements within the collection.
   *
   * @type {HTMLDivElement[]}
   */
  private marks: HTMLDivElement[] = []

  /**
   * The observer for intersection of mark elements.
   *
   * @type {IntersectionObserver}
   */
  private marksObserver: IntersectionObserver

  /**
   * The observable for mark elements.
   *
   * @type {MarksObservable}
   */
  private marksObservable: MarksObservable

  /**
   * The container element for the marks.
   *
   * @type {HTMLDivElement}
   */
  private marksContainer!: HTMLDivElement

  /**
   * The observer for resizing the collection.
   *
   * @type {ResizeObserver}
   */
  private segmentsContainerObserver: ResizeObserver

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
   * @default 'center'
   */
  @Prop() alignY: ScrollIntoViewOptions['block'] = 'center'

  /**
   * The currently active segment.
   *
   * @type {HTMLUiDirectorySegmentElement}
   */
  @State() segmentActive: HTMLUiDirectorySegmentElement

  /**
   * Watcher for changes to the active segment.
   *
   * @param {HTMLUiDirectorySegmentElement} segmentNew - The new active segment.
   * @param {HTMLUiDirectorySegmentElement} segmentOld - The previous active segment.
   * @returns {Promise<void>}
   */
  @Watch('segmentActive')
  async watchSegmentActive(
    segmentNew: HTMLUiDirectorySegmentElement,
    segmentOld: HTMLUiDirectorySegmentElement,
  ): Promise<void> {
    try {
      if (segmentOld) {
        await segmentOld.deactivate()
        await segmentNew.activate()

        requestAnimationFrame(() => {
          this.setMarksObservable()

          segmentNew.scrollIntoView({
            inline: this.alignX,
            block: this.alignY,
          })
        })
      }
    } catch (error) {
      console.error('Error setting segments:', error)
    }
  }

  /**
   * Lifecycle method that runs before the component is loaded.
   */
  componentWillLoad() {
    this.segments = Array.from(this.element.querySelectorAll('ui-directory-segment'))
    this.segmentActive = this.segments[0]
    this.segmentsContainerObserver = new ResizeObserver(this.handleResize)
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
  async componentDidLoad() {
    this.marks = Array.from(this.element.shadowRoot.querySelectorAll('.mark'))
    this.setMarksObservable()
    this.segmentsContainerObserver.observe(this.segmentsContainer)

    await this.segmentActive.activate()
  }

  /**
   * Lifecycle method that runs when the component is disconnected.
   */
  disconnectedCallback() {
    this.marksObserver.disconnect()
    this.segmentsContainerObserver.disconnect()

    if (this.animationFrameInstance !== null) {
      cancelAnimationFrame(this.animationFrameInstance)
    }
  }

  /**
   * Sets the observable marks based on the active segment index.
   */
  private setMarksObservable(): void {
    const segmentActiveIndex = this.segments.indexOf(this.segmentActive)

    this.marksObservable = {
      preceding: this.marks[segmentActiveIndex - 1],
      following: this.marks[segmentActiveIndex + 1],
    }

    this.observeMarks()
  }

  /**
   * Observes the marks for intersection changes.
   */
  private observeMarks(): void {
    Object.values(this.marksObservable).forEach((mark) => {
      if (mark) {
        this.marksObserver.observe(mark)
      }
    })
  }

  /**
   * Scrolls the marks container to the preceding mark.
   */
  private scrollMarks(): void {
    this.marksObserver.disconnect()

    requestAnimationFrame(() => {
      const { preceding } = this.marksObservable

      if (preceding) {
        this.marksContainer.scrollLeft = preceding.offsetLeft
      }
    })
  }

  /**
   * Handles the click event on a mark.
   *
   * @param {HTMLUiDirectorySegmentElement} segment - The segment associated with the clicked mark.
   */
  private handleMarkClick = (segment: HTMLUiDirectorySegmentElement): void => {
    if (this.segmentActive !== segment) {
      this.segmentActive = segment
    }
  }

  /**
   * Handles the resize event and adjusts the scroll position of the segments container.
   */
  private handleResize = (): void => {
    const segmentActiveRect = this.segmentActive.getBoundingClientRect()
    const segmentsContainerRect = this.segmentsContainer.getBoundingClientRect()

    let scrollAmount = 0

    switch (this.alignX) {
      case 'start':
        scrollAmount = segmentActiveRect.left - segmentsContainerRect.left
        break
      case 'center':
        scrollAmount =
          segmentActiveRect.left -
          segmentsContainerRect.left -
          (segmentsContainerRect.width / 2 - segmentActiveRect.width / 2)
        break
      case 'end':
        scrollAmount =
          segmentActiveRect.left -
          segmentsContainerRect.left -
          (segmentsContainerRect.width - segmentActiveRect.width)
        break
    }

    this.observeMarks()
    this.segmentsContainer.scrollTo({
      left: this.segmentsContainer.scrollLeft + scrollAmount,
      behavior: 'instant',
    })
  }

  /**
   * Gets the attributes for a mark element.
   *
   * @param {HTMLUiDirectorySegmentElement} segment - The segment associated with the mark.
   * @returns {Record<string, string>} The attributes for the mark element.
   */
  private getMarkAttributes(segment: HTMLUiDirectorySegmentElement): Record<string, string> {
    const isActive = segment === this.segmentActive

    return {
      class: 'mark',
      part: `mark ${isActive ? 'active' : ''}`,
    }
  }

  /**
   * Renders the component.
   */
  render() {
    return (
      <Host>
        <div part="marks" class="marks" ref={(element) => (this.marksContainer = element)}>
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
        <div part="segments" class="segments" ref={(element) => (this.segmentsContainer = element)}>
          <slot />
        </div>
      </Host>
    )
  }
}
