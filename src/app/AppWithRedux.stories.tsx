import type { Meta, StoryObj } from '@storybook/react'
import App from 'app/App'
import { ReduxStoreProviderDecorator } from 'stories/decorators/ReduxStoreProviderDecorator'

const meta: Meta<typeof App> = {
  title: 'TODOLISTS/AppWithRedux',
  component: App,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [ReduxStoreProviderDecorator],
}

export default meta

/*type Story = StoryObj<typeof AppWithRedux>;*/
type Story = StoryObj<typeof meta>

/*export const AppWithReduxStory: Story = {}*/
export const AppWithReduxStory = (props: any) => {
  return <App demo={true} />
}
