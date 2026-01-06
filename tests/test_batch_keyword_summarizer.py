import unittest
from unittest.mock import patch, MagicMock, mock_open
import sys
import os
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- MOCK HEAVY DEPENDENCIES BEFORE IMPORT ---
mock_vader_module = MagicMock()
sys.modules['vaderSentiment.vaderSentiment'] = mock_vader_module
sys.modules['src.segmentation.summarizer'] = MagicMock()
sys.modules['src.segmentation.keywords'] = MagicMock()

# Now import
from src.segmentation.batch_keyword_summarizer import process_single_file, sentiment_analyzer

class TestBatchKeywordSummarizer(unittest.TestCase):

    def setUp(self):
        # Reset mocks if needed, or configure them here
        pass

    @patch('src.segmentation.batch_keyword_summarizer.os.path.exists')
    @patch('src.segmentation.batch_keyword_summarizer.open', new_callable=mock_open)
    @patch('src.segmentation.batch_keyword_summarizer.json.load')
    @patch('src.segmentation.batch_keyword_summarizer.json.dump')
    def test_process_single_file(self, mock_json_dump, mock_json_load, mock_file, mock_exists):
        mock_exists.return_value = True
        
        # Configure mocked modules
        from src.segmentation.summarizer import summarize_segment
        summarize_segment.return_value = "Summary text"
        
        from src.segmentation.keywords import keyword_extractor
        keyword_extractor.return_value = ["k1", "k2"]
        
        # Configure the ALREADY INITIALIZED mock instance
        sentiment_analyzer.polarity_scores.return_value = {"compound": 0.9}

        input_data = {
            "file": "test.json",
            "bert_segments": [{"segment_id": 1, "text": "Good vibes", "start_time": 0, "end_time": 1}]
        }
        mock_json_load.return_value = input_data
        
        process_single_file("test.json")
        
        self.assertTrue(mock_json_dump.called)
        args, _ = mock_json_dump.call_args
        output = args[0]
        self.assertEqual(output[0]['sentiment']['score'], 0.9)
        self.assertEqual(output[0]['summary'], "Summary text")

if __name__ == '__main__':
    unittest.main()
