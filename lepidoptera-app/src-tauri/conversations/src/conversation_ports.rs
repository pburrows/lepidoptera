use crate::models::conversation_result::ConversationResult;
use anyhow::Result;
use crate::models::create_message_request::CreateMessageRequest;
use crate::models::message_result::MessageResult;

pub trait ConversationManager: Send + Sync {
    fn list_conversations(&self, scope: String, scope_id: String) -> Result<ConversationResult>;
    fn get_messages_in_conversation(&self, conversation_id: String) -> Result<Vec<MessageResult>>;
    fn create_message(&self, message: CreateMessageRequest) -> Result<MessageResult>;
}