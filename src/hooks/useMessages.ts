import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Message = Database['public']['Tables']['messages']['Row']

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('=== MESSAGES HOOK INITIALIZED ===')
    
    // Fetch initial messages
    fetchMessages()
    
    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: 'deleted_at=is.null'
        },
        (payload) => {
          console.log('=== REAL-TIME MESSAGE EVENT ===', payload.eventType)
          
          if (payload.eventType === 'INSERT') {
            // Fetch messages again to get the complete data with profiles
            fetchMessages()
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id 
                  ? { ...msg, ...payload.new } as Message
                  : msg
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id))
          }
        }
      )
      .subscribe((status) => {
        console.log('=== SUBSCRIPTION STATUS ===', status)
      })

    return () => {
      console.log('=== CLEANING UP MESSAGES SUBSCRIPTION ===')
      subscription.unsubscribe()
    }
  }, [])

  const fetchMessages = async () => {
    try {
      setError(null)
      console.log('=== FETCHING MESSAGES ===')
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (
            nickname,
            avatar_url
          )
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) {
        console.error('=== FETCH MESSAGES ERROR ===', error)
        throw error
      }
      
      console.log('=== MESSAGES FETCHED ===', data?.length || 0, 'messages')
      console.log('=== SAMPLE MESSAGE ===', data?.[0])
      
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch messages')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content: string, userId: string) => {
    try {
      setError(null)
      console.log('=== SENDING MESSAGE ===', { content, userId })
      
      const { error } = await supabase
        .from('messages')
        .insert({
          content: content.trim(),
          user_id: userId,
        })

      if (error) {
        console.error('=== MESSAGE SEND ERROR ===', error)
        throw new Error(`Failed to send message: ${error.message}`)
      }
      
      console.log('=== MESSAGE SENT SUCCESSFULLY ===')
    } catch (error) {
      console.error('Send message error:', error)
      throw error
    }
  }

  const deleteMessage = async (messageId: string, userId: string) => {
    try {
      setError(null)
      const { error } = await supabase
        .from('messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting message:', error)
      throw error
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
    refetch: fetchMessages,
  }
}