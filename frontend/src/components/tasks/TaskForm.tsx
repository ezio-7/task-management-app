import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { createTask } from '../../features/tasks/taskSlice';
import { taskSchema, TaskFormData } from '../../utils/validation';
import { AppDispatch } from '../../store';

const TaskForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'PENDING',
    },
  });
  
  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      await dispatch(createTask(data)).unwrap();
      reset();
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 sticky top-4">
      <h2 className="text-lg font-medium mb-4 flex items-center text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        Add New Task
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="form-input"
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="form-error">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="form-label">
            Description (optional)
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="form-input"
            placeholder="Enter task description"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="form-input"
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn btn-primary flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;