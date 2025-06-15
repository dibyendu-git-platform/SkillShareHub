import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const courseCategories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'business', label: 'Business' },
  { value: 'language', label: 'Language' }
];

const EditCourse = () => {
    const { id } = useParams();
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            tags: [],
        },
    });

    useEffect(() => {
        // Fetch course data by ID
        const token = localStorage.getItem('token');
        if (!token) return; // Handle case where token is not available
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/course/single/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
        // Assuming the response contains the course data   
            const courseData = response.data;
            setValue('title', courseData.title);
            setValue('description', courseData.description);
            setValue('category', courseData.category);
            setValue('price', courseData.price);
            setValue('isSubscription', courseData.isSubscription);
            setValue('published', courseData.published);
            setTags(courseData.tags || []);
        }).catch((error) => {
            console.error('Error fetching course data:', error);
        });  
        
    }, [id, setValue]);

    useEffect(() => {
        setValue('tags', tags);
    }, [tags, setValue]);

    const addTag = (tag) => {
        const currentTags = tags.slice();
        if (!currentTags.includes(tag)) {
        const updatedTags = [...currentTags, tag];
            setTags(updatedTags);
        }
    };

    const removeTag = (index) => {
        const currentTags = tags.slice();
        const updatedTags = currentTags.filter((_, i) => i !== index);
        setTags(updatedTags);
    };

    const handleKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
        e.preventDefault();
        addTag(tagInput.trim());
            setTagInput('');
        }
    };

    const onSubmit = data => {
        // handle form submission
        console.log('Form submitted:', data);
        // Here you would typically send the data to your backend API
        const token = localStorage.getItem('token');
        if (!token) return; 
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('tags', JSON.stringify(data.tags));
        formData.append('price', data.price);
        formData.append('isSubscription', data.isSubscription);
        formData.append('published', data.published);

        axios.put(`${import.meta.env.VITE_BASE_URL}/api/v1/course/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
                // Add any other headers you need, like Authorization
            }
        }).then(response => {
            console.log('Course saved successfully:', response.data);
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
                });
                Toast.fire({
                icon: "success",
                title: "Course Created successfully"
                });
            navigate('/courses'); // Redirect to courses list or wherever you want
            // Redirect or show success message
        }   ).catch(error => {
            console.error('Error saving course:', error);
            // Handle error, show message to user
        }); 
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Course</h2>
            <form className="space-y-5" id="courseForm" onSubmit={handleSubmit(onSubmit)}>
                {/* <!-- Title --> */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                    <input type="text" name="title" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200" {...register("title", { required: "this field is required", maxLength: 50, minLength:5 })} />
                     {errors.title && <p role="alert" className='text-red-600'>{errors.title?.message}</p>}
                </div>

                {/* <!-- Description --> */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200" {...register("description")}></textarea>
                    {errors.description && <p role="alert" className='text-red-600'>{errors.description?.message}</p>}
                </div>

                {/* <!-- Category --> */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category" className="w-full border border-gray-300 rounded-lg px-3 py-2" {...register("category", { required: "this field is required"})}>
                        <option value="">Select a category</option>
                        {courseCategories.map((category) => (
                        <option key={category.value} value={category.value}>{category.label}</option>))}
                    </select>
                    {errors.category && <p role="alert" className='text-red-600'>{errors.category?.message}</p>}
                </div>

                {/* <!-- Tags --> */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md">
                        {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                        >
                            {tag}
                            <button
                            type="button"
                            onClick={() => {removeTag(index)}}
                            className="text-red-500 hover:text-red-700 p-0.5! "
                            >
                            &times;
                            </button>
                        </span>
                        ))}
                        <input
                        type="text"
                        className="flex-1 min-w-[120px] border-none outline-none focus:ring-0 text-sm"
                        placeholder="Type and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        />
                    </div>
                    <input type="hidden" {...register('tags')} />
                    <p className="text-xs text-gray-500 mt-1">Press Enter or comma to add a tag.</p>
                    {errors.tags && <p role="alert" className='text-red-600'>{errors.tags?.message}</p>}
                </div>

                {/* <!-- Price --> */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input type="number" name="price" className="w-full border border-gray-300 rounded-lg px-3 py-2" min="0" {...register("price", { required: "this field is required"})}/>
                    {errors.price && <p role="alert" className='text-red-600'>{errors.price?.message}</p>}
                </div>

                {/* <!-- Subscription --> */}
                <div className="flex items-center space-x-2">
                    <input type="checkbox" name="isSubscription" id="isSubscription" className="h-4 w-4 text-blue-600 border-gray-300 rounded" {...register("isSubscription")}/>
                    <label htmlFor="isSubscription" className="text-sm text-gray-700">Subscription Based Course</label>
                    {errors.isSubscription && <p role="alert" className='text-red-600'>{errors.isSubscription?.message}</p>}
                </div>

                {/* <!-- Published --> */}
                <div className="flex items-center space-x-2">
                    <input type="checkbox" name="published" id="published" className="h-4 w-4 text-green-600 border-gray-300 rounded" {...register("published")}/>
                    <label htmlFor="published" className="text-sm text-gray-700">Publish this Course</label>
                    {errors.published && <p role="alert" className='text-red-600'>{errors.published?.message}</p>}
                </div>

                {/* <!-- Submit --> */}
                <div>
                    <button type="submit" className="bg-blue-600 text-black px-5 py-2 rounded-lg border-black border-2 hover:bg-blue-700">
                        Update Course
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditCourse;
