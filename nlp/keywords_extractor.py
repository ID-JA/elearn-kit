from flask import Flask, request, jsonify
from keybert import KeyBERT

app = Flask(__name__)
kw_model = KeyBERT('allenai/scibert_scivocab_uncased')

@app.route('/extract_keywords', methods=['POST'])
def extract_keywords():
    data = request.get_json()
    text = data.get('query')
    if not text:
        return jsonify({'error': 'No query provided'}), 400

    keywords = kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=(1, 2),
        stop_words='english',
        use_mmr=True,
        diversity=0.7,
        top_n=3
    )
    return jsonify({'keywords': [kw[0] for kw in keywords]})

if __name__ == '__main__':
    app.run(debug=True)