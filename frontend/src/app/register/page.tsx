'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { Church } from 'lucide-react';
import toast from "react-hot-toast";

interface RegisterFormData {
  churchName: string;
  legalRegNo: string;
  address: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      setLoading(true);
      await api.post('/auth/register-church', {
        churchName: data.churchName,
        legalRegNo: data.legalRegNo,
        address: data.address,
        adminName: data.adminName,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("Email address is already registered.");
      } else {
        toast.error("Registration failed.");
      }
    }
    // } catch (err: any) {
    //   console.error(err);
    
    //   if (err.response?.status === 409) {
    //     setError("This email address is already registered.");
    //   } else {
    //     setError(
    //       err.response?.data?.message ||
    //       "Registration failed. Please try again."
    //     );
    //   }
    // }
    //catch (err: any) { throw err;
    //   // setError(err.response?.data?.message || 'Registration failed. Please try again.');
    // } 
    finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your church has been registered. Please check your email to verify your account before logging in.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Church className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Register Your Church</h1>
          <p className="text-gray-600 mt-2">Join Rwanda Church Management System</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Church Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Church Name</label>
                <input
                  type="text"
                  {...register('churchName', { required: 'Church name is required' })}
                  className="w-full px-4 py-3 border border-indigo-300 placeholder-gray-500 text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-indigo-50"
                  placeholder="Your Church Name"
                />
                {errors.churchName && (
                  <p className="text-red-600 text-sm mt-1">{errors.churchName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Legal Registration Number</label>
                <input
                  type="text"
                  {...register('legalRegNo', { required: 'Legal registration number is required' })}
                  className="w-full px-4 py-3 border border-indigo-300 placeholder-gray-500 text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-indigo-50"
                  placeholder="RDB/REG/12345"
                />
                {errors.legalRegNo && (
                  <p className="text-red-600 text-sm mt-1">{errors.legalRegNo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  className="w-full px-4 py-3 border border-indigo-300 placeholder-gray-500 text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-indigo-50"
                  placeholder="Kigali, Rwanda"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrator Account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  {...register('adminName', { required: 'Admin name is required' })}
                  className="w-full px-4 py-3 border border-indigo-300 placeholder-gray-500 text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-indigo-50"
                  placeholder="John Doe"
                />
                {errors.adminName && (
                  <p className="text-red-600 text-sm mt-1">{errors.adminName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  {...register('adminEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg placeholder-gray-500 text-gray-700 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-indigo-50"
                  placeholder="admin@example.com"
                />
                {errors.adminEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.adminEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  {...register('adminPassword', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg placeholder-gray-500 text-gray-700 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-indigo-50"
                  placeholder="••••••••"
                />
                {errors.adminPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.adminPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === watch('adminPassword') || 'Passwords do not match',
                  })}
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg placeholder-gray-500 text-gray-700 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-indigo-50"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register Church'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
