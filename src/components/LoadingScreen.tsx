interface LoadingScreenProps {
  company: string;
  progress?: number;
  message?: string;
}

export function LoadingScreen({ company, progress = 0, message = 'Starting analysis...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-lg w-full">
        {/* Spinner */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Analyzing {company}
        </h2>
        <p className="text-gray-600 text-center mb-8">
          This may take 2-3 minutes
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            {Math.round(progress)}% Complete
          </p>
        </div>

        {/* Current Step Message */}
        <div className="text-center">
          <p className="text-lg font-medium text-blue-600">{message}</p>
        </div>
      </div>
    </div>
  );
}
