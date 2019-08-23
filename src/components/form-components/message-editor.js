'use strict';
import React, { useState, useEffect } from 'react';
import Draft from 'draft-js';
const { convertFromRaw, convertToRaw, CompositeDecorator, ContentState, Editor, EditorState } = Draft;

class MessageEditor extends React.Component {
	constructor(props) {
		super(props);

		const {
			data: { what, where, repeat: { frequency, week, day }, start_date, end_date, start_time, end_time }
		} = props;
		const rawContent = {
			blocks: [
				{
					text: `${what} at ${where} on ${day[0]}, ${start_date} from ${start_time} - ${end_time}.`,
					type: 'unstyled',
					entityRanges: [
						{ offset: 0, length: what.length, key: 'what' },
						{ offset: what.length + 4, length: where.length, key: 'where' },
						{ offset: what.length + 4 + where.length + 4, length: day[0].length, key: 'frequency' }
					]
				}
			],

			entityMap: {
				what: {
					type: 'TOKEN',
					mutability: 'IMMUTABLE'
				},
				where: {
					type: 'TOKEN',
					mutability: 'IMMUTABLE'
				},
				frequency: {
					type: 'TOKEN',
					mutability: 'IMMUTABLE'
				}
			}
		};

		const decorator = new CompositeDecorator([
			{
				strategy: getEntityStrategy('IMMUTABLE'),
				component: TokenSpan
			},
			{
				strategy: getEntityStrategy('MUTABLE'),
				component: TokenSpan
			},
			{
				strategy: getEntityStrategy('SEGMENTED'),
				component: TokenSpan
			}
		]);

		const blocks = convertFromRaw(rawContent);

		this.state = {
			editorState: EditorState.createWithContent(blocks, decorator)
		};

		this.focus = () => this.refs.editor.focus();
		this.onChange = (editorState) => {
            this.setState({ editorState });
            const content = convertToRaw(editorState.getCurrentContent());
            this.props.onChange(content.blocks[0].text);
            console.log("Editor on change", convertToRaw(editorState.getCurrentContent()))
		};
		this.logState = () => {
			const content = this.state.editorState.getCurrentContent();
			console.log(convertToRaw(content));
		};
	}

	render() {
		return (
			<div style={styles.root}>
				<div style={styles.editor} onClick={this.focus}>
					<Editor
						editorState={this.state.editorState}
						onChange={this.onChange}
						placeholder="Enter some text..."
						ref="editor"
					/>
				</div>
				{/* <input onClick={this.logState} style={styles.button} type="button" value="Log State" /> */}
			</div>
		);
	}
}

function getEntityStrategy(mutability) {
	return function(contentBlock, callback, contentState) {
		contentBlock.findEntityRanges((character) => {
			const entityKey = character.getEntity();
			if (entityKey === null) {
				return false;
			}
			return contentState.getEntity(entityKey).getMutability() === mutability;
		}, callback);
	};
}

function getDecoratedStyle(mutability) {
	switch (mutability) {
		case 'IMMUTABLE':
			return styles.immutable;
		case 'MUTABLE':
			return styles.mutable;
		case 'SEGMENTED':
			return styles.segmented;
		default:
			return null;
	}
}

const TokenSpan = (props) => {
	const style = getDecoratedStyle(props.contentState.getEntity(props.entityKey).getMutability());
	return (
		<span data-offset-key={props.offsetkey} style={style}>
			{props.children}
		</span>
	);
};

const styles = {
	root: {
		margin: '15px 0',
		lineHeight: '2em'
	},
	editor: {
		border: '1px solid #ccc',
		cursor: 'text',
		minHeight: 120,
		padding: 10
	},
	button: {
		marginTop: 10,
		textAlign: 'center'
	},
	immutable: {
		borderBottom: '1px dotted gray',
		padding: '2px 0'
	},
	mutable: {
		backgroundColor: 'rgba(204, 204, 255, 1.0)',
		padding: '2px 0'
	},
	segmented: {
		backgroundColor: 'rgba(248, 222, 126, 1.0)',
		padding: '2px 0'
	}
};

export default MessageEditor;

// ReactDOM.render(
// 	<EntityEditorExample
// 		data={{
// 			start_date: '09/12/2019',
// 			end_date: '10/12/2019',
// 			start_time: '10:00am',
// 			end_time: '4:00pm',
// 			what: 'Free food',
// 			repeat: {
// 				frequency: 'every week',
// 				week: '',
// 				day: [ 'Mon', 'Wed' ]
// 			},
// 			where: '1111 19st NW, Washington D.C. 20879'
// 		}}
// 	/>,
// 	document.getElementById('target')
// );
