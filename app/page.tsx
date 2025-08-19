'use client'

import React, { useState, useCallback } from 'react'
import axios from 'axios'
import { Upload, Link, RefreshCw, Camera, Sparkles, Heart, Mountain, Moon, Zap, Lock } from 'lucide-react'

interface CaptionResponse {
  success: boolean
  caption: string
  base_caption: string
  vibe: string
}

const vibeIcons = {
  happy: Heart,
  sad: Moon,
  adventurous: Mountain,
  romantic: Heart,
  mysterious: Lock,
  energetic: Zap
}

const vibeColors = {
  happy: 'from-yellow-400 to-pink-400',
  sad: 'from-blue-400 to-gray-600',
  adventurous: 'from-green-400 to-blue-500',
  romantic: 'from-pink-400 to-red-400',
  mysterious: 'from-purple-400 to-gray-800',
  energetic: 'from-orange-400 to-red-500'
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [selectedVibe, setSelectedVibe] = useState('happy')
  const [userDescription, setUserDescription] = useState('')
  const [caption, setCaption] = useState('')
  const [baseCaption, setBaseCaption] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file')

  // Replace this with your actual ngrok URL from Colab
  const API_URL = 'https://8771f2d22306.ngrok-free.app'

  const vibes = [
    { id: 'happy', name: 'Happy', emoji: '😊' },
    { id: 'sad', name: 'Sad', emoji: '😢' },
    { id: 'adventurous', name: 'Adventurous', emoji: '🏔️' },
    { id: 'romantic', name: 'Romantic', emoji: '💕' },
    { id: 'mysterious', name: 'Mysterious', emoji: '🌙' },
    { id: 'energetic', name: 'Energetic', emoji: '⚡' }
  ]

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreviewImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }, [])

  const handleUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    setImageUrl(url)
    if (url) {
      setPreviewImage(url)
    }
  }, [])

  const generateCaption = async () => {
    if ((!selectedFile && !imageUrl) || !selectedVibe) return

    setIsLoading(true)
    setCaption('')

    try {
      let response

      if (uploadMethod === 'file' && selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('vibe', selectedVibe)
        formData.append('user_description', userDescription)

        response = await axios.post(`${API_URL}/generate-caption-upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else if (uploadMethod === 'url' && imageUrl) {
        response = await axios.post(`${API_URL}/generate-caption-url`, {
          image_url: imageUrl,
          vibe: selectedVibe,
          user_description: userDescription 
        })
      }

      if (response?.data.success) {
        setCaption(response.data.caption)
        setBaseCaption(response.data.base_caption)
      }
    } catch (error) {
      console.error('Error generating caption:', error)
      setCaption('Oops! Something went wrong. Please try again! 😅')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshCaption = async () => {
    if (!baseCaption) {
      // If no base caption, regenerate everything
      generateCaption()
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/refresh-caption`, {
        base_caption: baseCaption,
        vibe: selectedVibe,
        user_description: userDescription
      })

      if (response?.data.success) {
        setCaption(response.data.caption)
      }
    } catch (error) {
      console.error('Error refreshing caption:', error)
      setCaption('Oops! Something went wrong. Please try again! 😅')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Camera className="w-8 h-8 text-white" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              AI Caption Generator
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your photos into Instagram-worthy captions with AI magic ✨
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Panel - Upload & Settings */}
            <div className="space-y-6">
              {/* Upload Method Selector */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Choose Upload Method
                </h2>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setUploadMethod('file')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      uploadMethod === 'file'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    onClick={() => setUploadMethod('url')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      uploadMethod === 'url'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Image URL
                  </button>
                </div>

                {uploadMethod === 'file' ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-gray-300">Click to upload image</span>
                      {selectedFile && (
                        <span className="text-sm text-green-400 mt-1">
                          ✓ {selectedFile.name}
                        </span>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      placeholder="Paste image URL here..."
                      value={imageUrl}
                      onChange={handleUrlChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    />
                  </div>
                )}
              </div>

              {/* User Description Input */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Tell us about this moment
                </h2>
                <div className="relative">
                  <textarea
                    placeholder="e.g., 'Just got my dream job!', 'Sunday brunch with my bestie', 'After months of training'..."
                    value={userDescription}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        setUserDescription(e.target.value)
                      }
                    }}
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none"
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {userDescription.length}/200
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  💡 The more context you give, the more personalized your caption will be!
                </p>
                
                {/* Quick example buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    "Just achieved my goal!",
                    "Weekend vibes with friends",
                    "Trying something new today",
                    "Feeling grateful",
                    "Living my best life"
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setUserDescription(example)}
                      className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 rounded-full transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vibe Selector */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">Choose Your Vibe</h2>
                <div className="grid grid-cols-2 gap-3">
                  {vibes.map((vibe) => {
                    const IconComponent = vibeIcons[vibe.id as keyof typeof vibeIcons] || Heart
                    return (
                      <button
                        key={vibe.id}
                        onClick={() => setSelectedVibe(vibe.id)}
                        className={`p-4 rounded-xl transition-all transform hover:scale-105 ${
                          selectedVibe === vibe.id
                            ? `bg-gradient-to-r ${vibeColors[vibe.id as keyof typeof vibeColors]} shadow-lg text-white`
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl">{vibe.emoji}</span>
                          <span className="font-medium">{vibe.name}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateCaption}
                disabled={isLoading || (!selectedFile && !imageUrl)}
                className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Creating Your Perfect Caption...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Perfect Caption
                  </div>
                )}
              </button>
            </div>

            {/* Right Panel - Preview & Results */}
            <div className="space-y-6">
              {/* Image Preview */}
              {previewImage && (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                  <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {selectedVibe} {vibes.find(v => v.id === selectedVibe)?.emoji}
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Caption */}
              {caption && (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Your Caption</h2>
                    <button
                      onClick={refreshCaption}
                      disabled={isLoading}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all disabled:opacity-50"
                      title="Generate new caption"
                    >
                      <RefreshCw className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-4 border border-white/20">
                    <p className="text-white whitespace-pre-wrap leading-relaxed">
                      {caption}
                    </p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(caption)}
                    className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
                  >
                    Copy Caption ✨
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}