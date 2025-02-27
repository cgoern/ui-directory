export interface UiDirectorySegmentDetails {
  element: HTMLUiDirectorySegmentElement
  data: unknown | null
}

export interface UiDirectoryCollectionChangeEventData {
  segmentActive: UiDirectorySegmentDetails
  segmentPrevious?: UiDirectorySegmentDetails
}
