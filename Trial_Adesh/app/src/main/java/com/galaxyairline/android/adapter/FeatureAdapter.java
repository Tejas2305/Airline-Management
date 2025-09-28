package com.galaxyairline.android.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.galaxyairline.android.R;
import com.galaxyairline.android.model.Feature;

import java.util.List;

public class FeatureAdapter extends RecyclerView.Adapter<FeatureAdapter.ViewHolder> {
    
    private List<Feature> features;
    
    public FeatureAdapter(List<Feature> features) {
        this.features = features;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_feature, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Feature feature = features.get(position);
        holder.bind(feature);
    }

    @Override
    public int getItemCount() {
        return features.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        private ImageView imageIcon;
        private TextView textTitle;
        private TextView textDescription;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            imageIcon = itemView.findViewById(R.id.image_icon);
            textTitle = itemView.findViewById(R.id.text_title);
            textDescription = itemView.findViewById(R.id.text_description);
        }

        public void bind(Feature feature) {
            textTitle.setText(feature.getTitle());
            textDescription.setText(feature.getDescription());
            
            // Set icon based on feature icon string
            switch (feature.getIcon()) {
                case "Shield":
                    imageIcon.setImageResource(R.drawable.ic_shield);
                    break;
                case "Award":
                    imageIcon.setImageResource(R.drawable.ic_award);
                    break;
                case "Star":
                    imageIcon.setImageResource(R.drawable.ic_star);
                    break;
                default:
                    imageIcon.setImageResource(R.drawable.ic_star);
                    break;
            }
        }
    }
}