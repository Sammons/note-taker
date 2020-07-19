import { LoadingBarState } from "src/components/loading-bar"
import { NotesClient } from "src/clients/notes-client"
import { ListEditorState } from "src/components/list-editor"

export const ReloadCurrentNote = () => {
  console.log('reload')
  LoadingBarState.transient.enqueue(async () => {
    const value = await new NotesClient()
      .get<typeof ListEditorState.transient['localContent']>(
        `list-${ListEditorState.nav.noteName}`
      )
    if (value != null) {
      ListEditorState.transient.localContent = value
    } else {
      ListEditorState.transient.localContent = { elements: [] }
    }
  })
}