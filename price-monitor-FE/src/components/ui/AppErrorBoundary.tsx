import React from 'react'

interface State { hasError: boolean; error?: any }

export default class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('App render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || 'Unexpected error'
      return (
        <div className='min-h-screen flex items-center justify-center bg-white px-6'>
          <div className='max-w-md w-full space-y-4 text-center'>
            <h1 className='text-2xl font-bold text-brandBlack'>Something went wrong</h1>
            <p className='text-sm text-red-600'>{msg}</p>
            <button onClick={()=>window.location.reload()} className='text-sm px-4 py-2 rounded bg-brandGreen text-white'>Reload</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
