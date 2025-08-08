import { Button } from '@/components/ui/button';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, title, message, confirmText, cancelText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title || 'Confirmação de Envio'}</h3>
          <p className="text-gray-600 text-center mb-6">
            {message || 'Você tem certeza que deseja enviar o formulário? Por favor, verifique se todas as informações estão corretas antes de prosseguir.'}
          </p>
          
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              {cancelText || 'Cancelar'}
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {confirmText || 'Sim, Enviar Formulário'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;