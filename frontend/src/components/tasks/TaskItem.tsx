import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../../features/tasks/taskSlice';
import { AppDispatch } from '../../store';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED';
}

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStatusToggle = async () => {
    try {
      setIsLoading(true);
      const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
      await dispatch(
        updateTask({
          taskId: task.id,
          taskData: { status: newStatus },
        })
      ).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsLoading(true);
        await dispatch(deleteTask(task.id)).unwrap();
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await dispatch(
        updateTask({
          taskId: task.id,
          taskData: { title, description, status },
        })
      ).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden border-l-4 ${
      task.status === 'COMPLETED' ? 'border-green-500' : 'border-yellow-500'
    }`}>
      {isEditing ? (
        <div className="p-4 space-y-3">
          <div>
            <label htmlFor="edit-title" className="form-label">
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>
          
          <div>
            <label htmlFor="edit-description" className="form-label">
              Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="form-input"
            />
          </div>
          
          <div>
            <label htmlFor="edit-status" className="form-label">
              Status
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'PENDING' | 'COMPLETED')}
              className="form-input"
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className="btn btn-primary flex-1 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save
                </>
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary flex-1 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className={`text-lg font-medium ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {task.title}
                </h3>
                <span
                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {task.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                </span>
              </div>
              {task.description && (
                <p className={`text-gray-600 mt-1 ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : ''}`}>
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                title="Edit task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="text-gray-500 hover:text-red-600 transition-colors p-1"
                title="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleStatusToggle}
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
                task.status === 'COMPLETED'
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : task.status === 'COMPLETED' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Mark as Pending
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Mark as Completed
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;