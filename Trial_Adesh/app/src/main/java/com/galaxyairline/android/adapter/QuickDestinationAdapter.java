package com.galaxyairline.android.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.galaxyairline.android.R;
import com.galaxyairline.android.model.Destination;

import java.util.List;

public class QuickDestinationAdapter extends RecyclerView.Adapter<QuickDestinationAdapter.ViewHolder> {
    
    private List<Destination> destinations;
    private OnDestinationClickListener listener;
    
    public interface OnDestinationClickListener {
        void onDestinationClick(Destination destination);
    }
    
    public QuickDestinationAdapter(List<Destination> destinations, OnDestinationClickListener listener) {
        this.destinations = destinations;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_quick_destination, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Destination destination = destinations.get(position);
        holder.bind(destination, listener);
    }

    @Override
    public int getItemCount() {
        return destinations.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        private TextView textEmoji;
        private TextView textCity;
        private TextView textCode;
        private TextView textPrice;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            textEmoji = itemView.findViewById(R.id.text_emoji);
            textCity = itemView.findViewById(R.id.text_city);
            textCode = itemView.findViewById(R.id.text_code);
            textPrice = itemView.findViewById(R.id.text_price);
        }

        public void bind(Destination destination, OnDestinationClickListener listener) {
            textEmoji.setText(destination.getImage());
            textCity.setText(destination.getCity());
            textCode.setText(destination.getCode());
            textPrice.setText("from $" + destination.getPrice());
            
            itemView.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onDestinationClick(destination);
                }
            });
        }
    }
}