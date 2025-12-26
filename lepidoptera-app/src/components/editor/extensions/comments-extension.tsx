/**
 * Comments Extension for Tiptap
 * 
 * This extension enables inline conversations functionality.
 * Currently a placeholder - can be extended with:
 * - Comment markers/decorations
 * - Comment sidebar/panel
 * - Comment CRUD operations
 * - User mentions
 * - Threading/replies
 */
//
// import { Extension } from '@tiptap/core';
// import { Plugin, PluginKey } from '@tiptap/pm/state';
// import { Decoration, DecorationSet } from '@tiptap/pm/view';
//
// export interface CommentsOptions {
//   /**
//    * Whether conversations are enabled
//    */
//   enabled: boolean;
//
//   /**
//    * Callback when a comment is added
//    */
//   onAddComment?: (from: number, to: number, comment: string) => void;
//
//   /**
//    * Callback when a comment is removed
//    */
//   onRemoveComment?: (commentId: string) => void;
//
//   /**
//    * Get conversations for a given range
//    */
//   getComments?: (from: number, to: number) => Array<{ id: string; text: string; author: string }>;
// }
//
// /**
//  * Comments Extension
//  *
//  * This is a placeholder implementation. To fully implement:
//  * 1. Add comment storage (database/state management)
//  * 2. Create comment UI components (sidebar, popover, etc.)
//  * 3. Add comment markers/decorations in the editor
//  * 4. Implement comment CRUD operations
//  * 5. Add user authentication/authorization
//  */
// export const CommentsExtension = Extension.create<CommentsOptions>({
//   name: 'conversations',
//
//   addOptions() {
//     return {
//       enabled: true,
//       onAddComment: undefined,
//       onRemoveComment: undefined,
//       getComments: undefined,
//     };
//   },
//
//   addProseMirrorPlugins() {
//     return [
//       new Plugin({
//         key: new PluginKey('conversations'),
//         state: {
//           init() {
//             return DecorationSet.empty;
//           },
//           apply(tr, set) {
//             // TODO: Apply comment decorations based on stored conversations
//             return set;
//           },
//         },
//         props: {
//           decorations(state) {
//             // TODO: Return decorations for comment markers
//             return DecorationSet.empty;
//           },
//         },
//       }),
//     ];
//   },
//
//   addKeyboardShortcuts() {
//     return {
//       'Mod-Shift-c': () => {
//         // TODO: Open comment dialog for selected text
//         return false;
//       },
//     };
//   },
// });
//
// export default CommentsExtension;
//
