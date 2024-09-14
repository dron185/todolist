import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { action } from '@storybook/addon-actions'
import AddItemForm from 'common/components/AddItemForm/AddItemForm'
import TextField from '@mui/material/TextField/TextField'
import IconButton from '@mui/material/IconButton'
import AddBoxIcon from '@mui/icons-material/AddBox'
import React, { ChangeEvent, KeyboardEvent, useState } from 'react'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof AddItemForm> = {
  title: 'TODOLISTS/AddItemForm',
  component: AddItemForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    addItem: {
      description: 'Button clicked inside form',
      // action: 'clicked',
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { addItem: fn() },
}

export default meta
type Story = StoryObj<typeof AddItemForm>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

// 3 способа написания историй:
// 1. новый способ:
export const AddItemFormStory: Story = {}

// 2. старый способ:
export const AddItemFormStory1 = () => <AddItemForm addItem={action('addItem')} />

// 3. еще один способ:
export const AddItemFormErrorStory: Story = {
  render: (args) => {
    const [newItemTitle, setNewItemTitle] = React.useState('')
    const [inputError, setInputError] = useState<string | null>('Title is required')

    const maxTitleLength = 15
    const isAddItemPossible = newItemTitle.length && newItemTitle.length <= maxTitleLength

    const addNewItemHandler = () => {
      const trimmedTaskTitle = newItemTitle.trim()
      if (trimmedTaskTitle !== '') {
        args.addItem(trimmedTaskTitle)
      } else {
        setInputError('Title is required')
      }
      setNewItemTitle('')
    }

    const changeNewItemTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setNewItemTitle(e.currentTarget.value)
    }

    const addItemOnKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (inputError !== null) {
        setInputError(null)
      }

      if (e.key === 'Enter' && isAddItemPossible) {
        addNewItemHandler()
      }
    }
    return (
      <div>
        <TextField
          label='Enter a title'
          variant={'outlined'}
          className={inputError ? 'error' : ''}
          value={newItemTitle}
          size={'small'}
          error={!!inputError}
          helperText={inputError}
          onChange={changeNewItemTitleHandler}
          onKeyUp={addItemOnKeyDownHandler}
        />

        <IconButton
          onClick={addNewItemHandler}
          color={'primary'}
        >
          <AddBoxIcon />
        </IconButton>
      </div>
    )
  },
}

export const AddItemFormDisabledExample = (props: any) => (
  <AddItemForm
    disabled={true}
    addItem={action('addItem')}
  />
)
