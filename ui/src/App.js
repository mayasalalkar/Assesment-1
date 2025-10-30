import logo from './logo.png';
import './App.css';
import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    localSalesCount: '',
    foreignSalesCount: '',
    averageSaleAmount: ''
  });

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://localhost:5000/Commission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          localSalesCount: parseInt(formData.localSalesCount) || 0,
          foreignSalesCount: parseInt(formData.foreignSalesCount) || 0,
          averageSaleAmount: parseFloat(formData.averageSaleAmount) || 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError('Failed to calculate commission. Please check your inputs.');
        }
        setResults(null);
        return;
      }

      const data = await response.json();
      setResults(data);

    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please ensure the API is running at https://localhost:5000');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error:', err);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={logo} className="App-logo" alt="Avalpha Technologies Logo" />
          <h1 className="company-title">Avalpha Technologies</h1>
          <h2 className="app-subtitle">Commission Calculator</h2>
        </div>
      </header>

      <main className="main-content">
        <div className="calculator-container">
          <div className="form-section">
            <h3>Sales Information</h3>
            <form onSubmit={handleSubmit} className="calculator-form">
              <div className="form-group">
                <label htmlFor="localSalesCount">Local Sales Count</label>
                <input
                  type="number"
                  id="localSalesCount"
                  name="localSalesCount"
                  value={formData.localSalesCount}
                  onChange={handleInputChange}
                  placeholder="Enter number of local sales"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="foreignSalesCount">Foreign Sales Count</label>
                <input
                  type="number"
                  id="foreignSalesCount"
                  name="foreignSalesCount"
                  value={formData.foreignSalesCount}
                  onChange={handleInputChange}
                  placeholder="Enter number of foreign sales"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="averageSaleAmount">Average Sale Amount (£)</label>
                <input
                  type="number"
                  step="0.01"
                  id="averageSaleAmount"
                  name="averageSaleAmount"
                  value={formData.averageSaleAmount}
                  onChange={handleInputChange}
                  placeholder="Enter average sale amount"
                  min="0"
                  required
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={`calculate-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Calculating...' : 'Calculate Commission'}
              </button>
            </form>
          </div>

          <div className="results-section">
            <h3>Commission Results</h3>

            {!results && !error && (
              <p className="no-results">Enter sales data and click Calculate to see results</p>
            )}

            {results && (
              <>
                <div className="results-grid">
                  <div className="result-card avalpha-card">
                    <div className="result-header">
                      <h4>Avalpha Technologies</h4>
                      <span className="commission-rates">Local: 20% | Foreign: 35%</span>
                    </div>
                    <div className="result-breakdown">
                      <div className="breakdown-item">
                        <span>Local Commission:</span>
                        <span>£{results.avalphaLocal.toFixed(2)}</span>
                      </div>
                      <div className="breakdown-item">
                        <span>Foreign Commission:</span>
                        <span>£{results.avalphaForeign.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="result-amount">
                      £{results.avalphaTotal.toFixed(2)}
                    </div>
                  </div>

                  <div className="result-card competitor-card">
                    <div className="result-header">
                      <h4>Competitor</h4>
                      <span className="commission-rates">Local: 2% | Foreign: 7.55%</span>
                    </div>
                    <div className="result-breakdown">
                      <div className="breakdown-item">
                        <span>Local Commission:</span>
                        <span>£{results.competitorLocal.toFixed(2)}</span>
                      </div>
                      <div className="breakdown-item">
                        <span>Foreign Commission:</span>
                        <span>£{results.competitorForeign.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="result-amount">
                      £{results.competitorTotal.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="advantage-indicator">
                  <p className="advantage-text">
                    Avalpha Technologies Advantage:
                    <strong> £{(results.avalphaTotal - results.competitorTotal).toFixed(2)}</strong>
                  </p>
                  <p className="advantage-percentage">
                    ({(((results.avalphaTotal - results.competitorTotal) / results.competitorTotal) * 100).toFixed(1)}% higher commission)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 Avalpha Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
