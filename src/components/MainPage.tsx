import * as React from "react";

import Note from './Note/Note';
import Tag from './Tag/Tag'
import './MainPage.scss';
import { addTag } from '../utils'

interface IProps {}
interface IState {
    note: String,
    notes: string[],
    tags: string[],
    selectedTag: String,
    isSelectTag: Boolean
    noteForEdit: Number
}

class MainPage extends React.Component<IProps, IState> {
    state = { 
        note: '',
        notes: [],
        tags: [],
        selectedTag: '',
        isSelectTag: false
        noteForEdit: -1
    }

    selectTag = (tag: String) => {
        this.setState({
            selectedTag: tag,
            isSelectTag: !this.state.isSelectTag
        })}

    handlerInputChange = event => 
        this.setState({
            note: event.target.value
        })

    createNote =  () => {
        if (this.state.note) {
            this.setState({
                notes: [...this.state.notes, this.state.note],
                tags: Array.from(new Set([...this.state.tags, ...addTag(this.state.note, true)])),
                isSelectTag: false,
                selectedTag: ''
            });
        } else { alert("Empty data!!!"); }
    }

    createTag = () => {
        if (this.state.note) {
            this.setState({
                tags: Array.from(new Set([...this.state.tags, ...addTag(this.state.note, false)]))
            })
        } else { alert("Empty data!!!"); }
    }

    removeTag = index => {
        this.state.tags.splice(index,1);
        this.setState({tags: this.state.tags})
    }

    removeNote = index => {
        this.state.notes.splice(index,1);
        this.setState({notes: this.state.notes})
    }

    editNote = index => {
        this.setState({
            noteForEdit: index
        })
    }

    viewNote = index => {
        alert(this.state.notes[index])
    }

    viewAllNotes = () => {
        this.setState({
            isSelectTag: false,
            selectedTag: ''
        })
    }

    filterNotesByTag = () => {
        const { notes, selectedTag, isSelectTag } = this.state;

        if (isSelectTag) {
            return notes.filter(words => 
                words.includes(selectedTag) || words.includes(selectedTag.slice(1)) ? true : false
            );
        } else {
            return notes;
        }
    } 

    saveChangesToNote = ({index, text}) => {
        this.state.notes[index] = text;
        this.setState({
            notes: this.state.notes,
            noteForEdit: -1
        })
    }

    render() {
        const { tags, selectedTag } = this.state;

        return (
            <div className="list-note">
                <input type="text" onChange={this.handlerInputChange} className="list-note__note-text"/>
                <div className="list-note__buttons">
                    <span className="list-note__add-tag" onClick={this.createTag}> Add tag </span>
                    <span className="list-note__add-note" onClick={this.createNote}> Add note </span>
                </div>

                {tags.length 
                    ? <div className="list-note__tags">
                        <span className="list-note__all-notes" onClick={this.viewAllNotes}>All notes</span>
                            {tags.map((element, index) => { 
                                return <Tag 
                                            text={element}
                                            key={index+element}
                                            selectTag={this.selectTag}
                                            selectedTag={selectedTag}
                                            isSelectTag={this.state.isSelectTag}
                                            removeTag={() => this.removeTag(index)}
                                        /> 
                            })}
                      </div>
                    : '' 
                }
                
                <div className="list-note__notes">
                    {this.filterNotesByTag()
                            .map((element, index) =>
                                <Note
                                    key={index + element}
                                    note={element}
                                    noteIndex={index}
                                    removeNote={() => this.removeNote(index)}
                                    viewNote={() => this.viewNote(index)}
                                    changeNote={() => this.changeNote(index)}
                                    isSelectTag={this.state.isSelectTag}
                                    noteForEdit={this.state.noteForEdit}
                                    editNote={() => this.editNote(index)}
                                    saveChangesToNote={this.saveChangesToNote}
                                     tags={this.state.tags}
                                />
                            )

                    }
                </div>
            </div>
        )
    }
}

export default MainPage;
