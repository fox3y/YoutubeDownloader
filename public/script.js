const form = document.getElementById('downloadForm');
const urlInput = document.getElementById('url');
const downloadBtn = document.getElementById('downloadBtn');
const status = document.getElementById('status');
const statusMessage = status.querySelector('.status-message');

const statusStates = {
  preparing: 'Preparando...',
  downloading: 'Baixando...',
  processing: 'Processando...',
  finalizing: 'Finalizando...',
  completed: 'Concluído!',
  error: 'Ocorreu um erro',
  invalidUrl: 'URL inválida',
  rateLimited: 'Muitas requisições. Tente novamente em alguns minutos.',
  timeout: 'Tempo limite excedido',
  serverError: 'Erro no servidor',
};

function showStatus(type, message) {
  status.className = `status ${type}`;
  statusMessage.textContent = message;
  status.classList.remove('hidden');
}

function hideStatus() {
  status.classList.add('hidden');
}

function setLoading(loading) {
  downloadBtn.disabled = loading;
  downloadBtn.classList.toggle('loading', loading);
  
  // Disable quality options during loading
  const qualityInputs = document.querySelectorAll('input[name="quality"]');
  qualityInputs.forEach(input => {
    input.disabled = loading;
  });
  
  urlInput.disabled = loading;
}

function getSelectedQuality() {
  const selected = document.querySelector('input[name="quality"]:checked');
  return selected ? selected.value : '720';
}

async function downloadVideo(url, quality) {
  const response = await fetch('/api/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, quality }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Download failed');
  }

  // Get filename from Content-Disposition header
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = 'video.mp4';
  
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }

  // Get blob and create download link
  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const url = urlInput.value.trim();
  const quality = getSelectedQuality();
  
  if (!url) {
    showStatus('error', statusStates.invalidUrl);
    return;
  }
  
  hideStatus();
  setLoading(true);
  
  try {
    showStatus('processing', statusStates.preparing);
    
    // Simulate progress updates
    setTimeout(() => {
      if (downloadBtn.disabled) {
        showStatus('processing', statusStates.downloading);
      }
    }, 1000);
    
    setTimeout(() => {
      if (downloadBtn.disabled) {
        showStatus('processing', statusStates.processing);
      }
    }, 3000);
    
    setTimeout(() => {
      if (downloadBtn.disabled) {
        showStatus('processing', statusStates.finalizing);
      }
    }, 5000);
    
    await downloadVideo(url, quality);
    
    showStatus('success', statusStates.completed);
    
    // Reset form after successful download
    setTimeout(() => {
      urlInput.value = '';
      hideStatus();
    }, 3000);
    
  } catch (error) {
    const errorMessage = error.message || statusStates.error;
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      showStatus('error', statusStates.rateLimited);
    } else if (errorMessage.includes('timeout') || errorMessage.includes('408')) {
      showStatus('error', statusStates.timeout);
    } else if (errorMessage.includes('server') || errorMessage.includes('500')) {
      showStatus('error', statusStates.serverError);
    } else if (errorMessage.includes('URL') || errorMessage.includes('400')) {
      showStatus('error', statusStates.invalidUrl);
    } else {
      showStatus('error', errorMessage);
    }
  } finally {
    setLoading(false);
  }
});

// Add URL validation on input
urlInput.addEventListener('input', () => {
  if (status.classList.contains('error')) {
    hideStatus();
  }
});
