const assistants = []

const addAssistant = (id, name, room) => {
    const existing_assistants = assistants.find( assistant => {
        assistant.name === name
    })
    
    if(existing_assistants) return {error: 'assistant already exists!'}
    if(!name || !room) return {error: 'name and room is required'}
    assistants.push({id, name, room})
    return {id, name, room}
}

const getAssistant = id => {
    return assistants.find(assistant => assistant.id === id)
}

const deleteAssistant = id => {
    const index = assistants.findIndex( assistant => assistant.id === id)
    if(index !== -1) return assistants.splice(index, 1)[0]
}

module.exports = { addAssistant, getAssistant, deleteAssistant }