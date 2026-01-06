import unittest
from unittest.mock import patch, MagicMock, mock_open
import sys
import os
import json

# Adjust path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- MOCK HEAVY DEPENDENCIES BEFORE IMPORT ---
# Mock bert_segmentation
mock_bert_module = MagicMock()
sys.modules['src.segmentation.bert_segmentation'] = mock_bert_module
# Mock text_tiling_segments from text_tiling (assuming it might also be heavy or just to be safe)
mock_tt_module = MagicMock()
sys.modules['src.segmentation.text_tiling'] = mock_tt_module

# Now import the module under test
from src.segmentation.batch_segmenter import segment_single_file, find_segment_time

class TestBatchSegmenter(unittest.TestCase):

    @patch('src.segmentation.batch_segmenter.os.path.exists')
    @patch('src.segmentation.batch_segmenter.open', new_callable=mock_open)
    @patch('src.segmentation.batch_segmenter.json.load')
    @patch('src.segmentation.batch_segmenter.json.dump')
    def test_segment_single_file(self, mock_json_dump, mock_json_load, mock_file, mock_exists):
        # Setup mocks
        mock_exists.return_value = True
        
        mock_transcript_data = {
            "segments": [
                {"text": "Hello world", "start": 0.0, "end": 2.0},
                {"text": "This is a test", "start": 2.0, "end": 4.0}
            ]
        }
        mock_json_load.return_value = mock_transcript_data
        
        # Configure the module-level mocks
        from src.segmentation.bert_segmentation import bert_topic_segments
        bert_topic_segments.return_value = ["Hello world", "This is a test"]
        
        from src.segmentation.text_tiling import text_tiling_segments
        text_tiling_segments.return_value = ["Hello world This is a test"]

        # Call the function
        segment_single_file("data/transcripts/test_audio.json")
        
        # Assertions
        mock_exists.assert_called_once_with("data/transcripts/test_audio.json")
        mock_file.assert_called()
        self.assertTrue(mock_json_dump.called)
        
        args, _ = mock_json_dump.call_args
        output_data = args[0]
        
        self.assertEqual(output_data['file'], "test_audio.json")
        self.assertEqual(len(output_data['bert_segments']), 2)

    def test_find_segment_time(self):
        whisper_segments = [
            {"text": "Hello", "start": 0.0, "end": 1.0},
            {"text": "world", "start": 1.0, "end": 2.0}
        ]
        start, end = find_segment_time("Hello world", whisper_segments)
        self.assertEqual(start, 0.0)
        self.assertEqual(end, 2.0)

if __name__ == '__main__':
    unittest.main()
