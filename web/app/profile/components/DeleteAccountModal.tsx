import { motion } from 'framer-motion';

interface DeleteAccountModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  deleteError: string;
  deletePassword: string;
  onClose: () => void;
  onConfirm: () => void;
  onPasswordChange: (password: string) => void;
}

export default function DeleteAccountModal({
  isOpen,
  isDeleting,
  deleteError,
  deletePassword,
  onClose,
  onConfirm,
  onPasswordChange
}: DeleteAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 p-6 rounded-xl border border-purple-500/20 max-w-md w-full mx-4"
      >
        <h3 className="text-xl font-bold text-white mb-4">Delete Account</h3>
        <p className="text-gray-400 mb-4">This action cannot be undone. Please enter your password to confirm.</p>
        
        {deleteError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/20 rounded text-red-300 text-sm">
            {deleteError}
          </div>
        )}
        
        <input
          type="password"
          placeholder="Enter your password"
          value={deletePassword}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!deletePassword || isDeleting}
            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-red-300/20 border-t-red-300 rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}