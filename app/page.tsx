'use client'

import React, { useState, useCallback } from 'react'
import { Upload, Link, RefreshCw, Camera, Sparkles, Heart, Mountain, Moon, Zap, Lock, Copy, CheckCircle, Image, Wand2, X } from 'lucide-react'

const vibeIcons = {
  happy: Heart,
  sad: Moon,
  adventurous: Mountain,
  romantic: Heart,
  mysterious: Lock,
  energetic: Zap
}

const vibeGradients = {
  happy: 'bg-gradient-to-r from-amber-400 to-orange-500',
  sad: 'bg-gradient-to-r from-blue-400 to-cyan-500',
  adventurous: 'bg-gradient-to-r from-emerald-400 to-teal-500',
  romantic: 'bg-gradient-to-r from-pink-400 to-rose-500',
  mysterious: 'bg-gradient-to-r from-purple-400 to-violet-500',
  energetic: 'bg-gradient-to-r from-red-400 to-pink-500'
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
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const API_URL = 'https://4b36b129111e.ngrok-free.app'

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
    if (url) setPreviewImage(url)
  }, [])

  const generateCaption = async () => {
    if ((!selectedFile && !imageUrl) || !selectedVibe) return
    setIsLoading(true)
    setCaption('')
    setBaseCaption('')
    try {
      let response
      if (uploadMethod === 'file' && selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('vibe', selectedVibe)
        formData.append('user_description', userDescription)

        response = await fetch(`${API_URL}/generate-caption-upload`, { method: 'POST', body: formData })
      } else if (uploadMethod === 'url' && imageUrl) {
        response = await fetch(`${API_URL}/generate-caption-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: imageUrl, vibe: selectedVibe, user_description: userDescription })
        })
      }
      if (response && response.ok) {
        const data = await response.json()
        if (data.success) {
          setCaption(data.caption)
          setBaseCaption(data.base_caption)
          setShowModal(true)
        }
      }
    } catch (error) {
      setCaption('Oops! Something went wrong. Please try again! 😅')
      setShowModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshCaption = async () => {
    if (!baseCaption) return generateCaption()
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/refresh-caption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base_caption: baseCaption, vibe: selectedVibe, user_description: userDescription })
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) setCaption(data.caption)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caption)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      {/* Control Panel */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
          Captionify
        </h1>

        {/* Upload Section */}
        <div className="mb-4">
          <p className="text-sm font-medium text-white mb-2">Upload Method</p>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setUploadMethod('file')}
              className={`flex-1 py-2 rounded-lg text-sm ${uploadMethod === 'file'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}>
              File
            </button>
            <button
              onClick={() => setUploadMethod('url')}
              className={`flex-1 py-2 rounded-lg text-sm ${uploadMethod === 'url'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}>
              URL
            </button>
          </div>
          {uploadMethod === 'file' ? (
            <label className="block w-full py-2 px-3 text-sm text-gray-300 bg-white/10 border border-white/20 rounded cursor-pointer hover:bg-white/20">
              <input type="file" className="hidden" onChange={handleFileSelect} />
              {selectedFile ? `✓ ${selectedFile.name}` : 'Choose File'}
            </label>
          ) : (
            <input
              type="url"
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="Paste Image URL..."
              className="w-full py-2 px-3 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
            />
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm font-medium text-white mb-2">Description</p>
          <textarea
            rows={3}
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)}
            placeholder="Add context..."
            className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 resize-none"
          />
        </div>

        {/* Vibes */}
        <div className="mb-6">
          <p className="text-sm font-medium text-white mb-2">Vibe</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(vibeIcons).map((vibe) => {
              const Icon = vibeIcons[vibe as keyof typeof vibeIcons]
              return (
                <button
                  key={vibe}
                  onClick={() => setSelectedVibe(vibe)}
                  className={`py-2 rounded-lg flex items-center justify-center text-xs gap-1 ${selectedVibe === vibe
                    ? `${vibeGradients[vibe as keyof typeof vibeGradients]} text-white`
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}>
                  <Icon className="w-3 h-3" />
                  {vibe}
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateCaption}
          disabled={isLoading || (!selectedFile && !imageUrl)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 font-semibold text-white hover:opacity-90 disabled:opacity-40 transition">
          {isLoading ? 'Generating...' : 'Generate Caption'}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-gray-900/90 rounded-3xl p-6 w-full max-w-3xl border border-white/20 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              {previewImage && (
                <div>
                  <p className="text-sm text-white mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-purple-400" /> Preview
                  </p>
                  <img src={previewImage} alt="Preview" className="w-full h-56 object-cover rounded-xl" />
                </div>
              )}
              {caption && (
                <div>
                  <p className="text-sm text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" /> Caption
                  </p>
                  <div className="bg-white/10 rounded-xl p-4 h-56 overflow-y-auto text-sm text-white mb-3">{caption}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={refreshCaption}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm flex items-center justify-center gap-2">
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm flex items-center justify-center gap-2">
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
