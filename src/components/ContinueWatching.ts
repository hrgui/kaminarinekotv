import { Lightning } from '@lightningjs/sdk'
import { ContentFeed } from '../global'

export default class CollectionComponent extends Lightning.Component {
  data?: ContentFeed

  static override _template() {
    return {
      w: 1920,
      h: 300,
      flex: { paddingTop: 40 },
      Header: {
        x: 0,
        y: 0,
        text: {
          text: 'Collection',
          fontFace: 'Semibold',
          fontSize: 40,
          lineHeight: 48,
          textColor: 0xbbffffff,
          paddingLeft: 90,
        },
      },
    }
  }

  get content() {
    return this.data?.items || []
  }

  get title() {
    return this.data?.title
  }

  override _init() {
    if (this.title) {
      this.tag('Header').patch({
        text: {
          text: this.title,
        },
      })
    }
  }
}
