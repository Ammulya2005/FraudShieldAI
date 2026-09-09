import { API } from '../api.js';

let modelRefreshTimer = null;

export function renderModels() {
  return `
    <div class="models-page">

      <!-- Page Header -->
      <div class="models-page-header">
        <div>
          <h2>Machine Learning Registry & Retraining</h2>
          <p class="models-page-description">
            Manage deployed models, monitor model performance, and trigger retraining.
          </p>
        </div>

        <button
          id="btn-train-model"
          class="btn btn-primary models-retrain-btn"
          type="button"
        >
          ⚡ Retrain Isolation Forest
        </button>
      </div>


      <!-- Training Status -->
      <div
        id="model-training-status"
        class="model-training-status hidden"
      >
        <div class="model-training-status-icon">
          ⚙️
        </div>

        <div class="model-training-status-content">
          <strong id="model-training-title">
            Retraining requested
          </strong>

          <span id="model-training-message">
            Training job has been submitted.
          </span>
        </div>
      </div>


      <!-- Model Metrics -->
      <div class="dashboard-grid models-metrics-grid">

        <div class="card">
          <h3>Active Model</h3>

          <div
            class="metric-val"
            style="font-size: 1.25rem; margin-top: 0.5rem;"
          >
            XGBoost-Ensemble-v2.1
          </div>

          <p
            style="
              color: var(--risk-low);
              font-size: 0.85rem;
              margin-top: 0.5rem;
            "
          >
            ● Deployed in Live Pipeline
          </p>
        </div>


        <div class="card">
          <h3>ROC-AUC Score</h3>

          <div class="metric-val">
            0.984
          </div>
        </div>


        <div class="card">
          <h3>F1-Score</h3>

          <div class="metric-val">
            0.941
          </div>
        </div>

      </div>


      <!-- Model Registry -->
      <div class="card table-container">

        <div class="models-registry-header">
          <div>
            <h3>Model Registry</h3>

            <p class="models-registry-subtitle">
              Available trained model artifacts
            </p>
          </div>

          <span
            id="models-registry-status"
            class="models-registry-status"
          >
            Loading...
          </span>
        </div>


        <table class="data-table models-table">

          <thead>
            <tr>
              <th>Model Name</th>
              <th>Version</th>
              <th>Trained Date</th>
              <th>Status</th>
            </tr>
          </thead>


          <tbody id="models-tbody">

            <tr>
              <td
                colspan="4"
                style="text-align: center;"
              >
                Loading model artifacts...
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  `;
}


/* =========================================================
   RESPONSE NORMALIZATION
   ========================================================= */

function normalizeModelsResponse(response) {

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.models)) {
    return response.models;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }

  if (Array.isArray(response?.data?.models)) {
    return response.data.models;
  }

  return [];
}


/* =========================================================
   TRAINING STATUS
   ========================================================= */

function showTrainingStatus(title, message, type = 'info') {

  const container =
    document.getElementById('model-training-status');

  const titleElement =
    document.getElementById('model-training-title');

  const messageElement =
    document.getElementById('model-training-message');

  if (!container || !titleElement || !messageElement) {
    return;
  }

  titleElement.textContent = title;
  messageElement.textContent = message;

  container.classList.remove(
    'hidden',
    'training-success',
    'training-error',
    'training-running'
  );

  if (type === 'success') {
    container.classList.add('training-success');
  } else if (type === 'error') {
    container.classList.add('training-error');
  } else {
    container.classList.add('training-running');
  }
}


function hideTrainingStatus() {

  const container =
    document.getElementById('model-training-status');

  if (container) {
    container.classList.add('hidden');
  }
}


/* =========================================================
   LOAD MODEL REGISTRY
   ========================================================= */

async function loadModels() {

  const tbody =
    document.getElementById('models-tbody');

  const registryStatus =
    document.getElementById('models-registry-status');

  if (!tbody) {
    return [];
  }

  if (registryStatus) {
    registryStatus.textContent = 'Loading...';
  }

  tbody.innerHTML = `
    <tr>
      <td
        colspan="4"
        style="text-align: center;"
      >
        Loading model artifacts...
      </td>
    </tr>
  `;

  try {

    const response =
      await API.getModels();

    console.log(
      'ML Models API response:',
      response
    );

    const models =
      normalizeModelsResponse(response);


    /* -----------------------------------------------------
       No models
       ----------------------------------------------------- */

    if (!models.length) {

      tbody.innerHTML = `
        <tr>
          <td
            colspan="4"
            style="text-align: center;"
          >
            No trained model artifacts found.
          </td>
        </tr>
      `;

      if (registryStatus) {
        registryStatus.textContent = 'No models';
      }

      return [];
    }


    /* -----------------------------------------------------
       Render models
       ----------------------------------------------------- */

    tbody.innerHTML = models.map(model => {

      const modelName =
        model.name ||
        model.model_name ||
        'Isolation Forest';

      const version =
        model.version ||
        model.model_version ||
        'v1.0.0';

      const createdAt =
        model.created_at ||
        model.trained_at ||
        model.training_date ||
        Date.now();

      const status =
        model.status ||
        model.deployment_status ||
        'Operational';


      return `
        <tr>

          <td data-label="Model Name">
            <strong>
              ${modelName}
            </strong>
          </td>

          <td data-label="Version">
            <code>
              ${version}
            </code>
          </td>

          <td data-label="Trained Date">
            ${new Date(createdAt).toLocaleDateString()}
          </td>

          <td data-label="Status">
            <span class="badge badge-low">
              ${status}
            </span>
          </td>

        </tr>
      `;

    }).join('');


    if (registryStatus) {
      registryStatus.textContent =
        `${models.length} model${models.length === 1 ? '' : 's'}`;
    }

    return models;

  } catch (error) {

    console.error(
      'Failed to load model registry:',
      error
    );

    tbody.innerHTML = `
      <tr>
        <td
          colspan="4"
          style="text-align: center;"
        >
          Failed to load model artifacts.
        </td>
      </tr>
    `;

    if (registryStatus) {
      registryStatus.textContent = 'Error';
    }

    return [];
  }
}


/* =========================================================
   RETRAINING
   ========================================================= */

async function triggerRetraining() {

  const button =
    document.getElementById('btn-train-model');

  if (!button) {
    return;
  }


  /* Prevent duplicate clicks */

  button.disabled = true;

  button.dataset.originalText =
    button.innerHTML;

  button.innerHTML =
    '⏳ Starting Retraining...';


  showTrainingStatus(
    'Retraining requested',
    'Submitting the Isolation Forest training job...',
    'running'
  );


  try {

    const response =
      await API.triggerTraining({});

    console.log(
      'Training API response:',
      response
    );


    showTrainingStatus(
      'Retraining job submitted',
      'The backend accepted the training request. Checking the model registry...',
      'running'
    );


    /*
     * Give the backend a few seconds to create
     * the new model artifact.
     */

    clearTimeout(modelRefreshTimer);

    modelRefreshTimer =
      setTimeout(async () => {

        const models =
          await loadModels();


        if (models.length > 0) {

          showTrainingStatus(
            'Model registry updated',
            'A trained model artifact is now available in the registry.',
            'success'
          );

        } else {

          showTrainingStatus(
            'Training job submitted',
            'The job was accepted, but no new model artifact is visible yet.',
            'running'
          );

        }

      }, 5000);


    console.log(
      'Retraining request completed:',
      response
    );


  } catch (error) {

    console.error(
      'Failed to trigger model retraining:',
      error
    );


    showTrainingStatus(
      'Retraining failed',
      error?.message ||
        'The backend could not start the training job.',
      'error'
    );

  } finally {

    button.disabled = false;

    button.innerHTML =
      button.dataset.originalText ||
      '⚡ Retrain Isolation Forest';

  }
}


/* =========================================================
   PAGE EVENTS
   ========================================================= */

export async function initModelsEvents() {

  hideTrainingStatus();

  await loadModels();


  document
    .getElementById('btn-train-model')
    ?.addEventListener(
      'click',
      triggerRetraining
    );

}